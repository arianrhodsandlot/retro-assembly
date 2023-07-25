import { DropboxClient } from '../cloude-service/dropbox-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

interface ListOptions {
  pageSize?: number
  pageCursor?: string
  orderBy?: string
}

let dropboxCloudProvider: DropboxProvider

export class DropboxProvider implements FileSystemProvider {
  private client: DropboxClient

  private constructor() {
    this.client = new DropboxClient()
  }

  static getSingleton() {
    if (dropboxCloudProvider) {
      return dropboxCloudProvider as DropboxProvider
    }

    dropboxCloudProvider = new DropboxProvider()
    return dropboxCloudProvider
  }

  async getContent(path: string) {
    const result = await this.client.download({ path })
    // @ts-expect-error fileBlob is not declared in dropbox sdk's types
    return result.result.fileBlob
  }

  // path should start with a slash
  async create({ file, path }) {
    if (!file || !path) {
      return
    }
    return await this.client.create({
      path,
      contents: file,
    })
  }

  // todo: not implemented yet
  async delete(path) {
    console.info(path)
    await this
    throw new Error('not implemented')
  }

  async list(path: string) {
    const children: Awaited<ReturnType<typeof this.listChildrenByPages>>['items'] = []
    let listNextPage = async () => await this.listChildrenByPages(path, {})
    do {
      const result = await listNextPage()
      children.push(...result.items)
      listNextPage = result.listNextPage
    } while (listNextPage)

    if (children?.length) {
      RequestCache.set({ name: `${this.constructor.name}.peek`, path }, children)
    }

    return children.map(
      (item) =>
        new FileAccessor({
          name: item.name,
          directory: path,
          type: item['.tag'] === 'folder' ? 'directory' : 'file',
          fileSystemProvider: this,
        }),
    )
  }

  async peek(path: string) {
    const rawCache = await RequestCache.get({ name: `${this.constructor.name}.peek`, path })
    const children = rawCache?.value
    const fileAccessors: FileAccessor[] | undefined = children?.map(
      (item) =>
        new FileAccessor({
          name: item.name,
          directory: path,
          type: item['.tag'] === 'folder' ? 'directory' : 'file',
          fileSystemProvider: this,
        }),
    )
    return fileAccessors
  }

  private async listChildrenByPages(path: string, { pageSize = 200, pageCursor = '' }: ListOptions = {}) {
    const pager = { size: pageSize, cursor: '' }
    const params = pageCursor
      ? { cursor: pageCursor }
      : { path: path === '/' ? '' : path, include_media_info: true, limit: pageSize }

    const result = await this.client.list(params)

    const { entries: items, has_more: hasMore, cursor } = result.result
    let listNextPage
    if (hasMore && cursor) {
      pager.cursor = cursor
      listNextPage = async () => await this.listChildrenByPages(path, { pageCursor: pager.cursor })
    }

    return { items, pager, listNextPage }
  }
}
