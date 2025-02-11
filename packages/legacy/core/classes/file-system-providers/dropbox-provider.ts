import { DropboxClient } from '../cloude-service/dropbox-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import type { FileSystemProvider } from './file-system-provider'

interface ListOptions {
  orderBy?: string
  pageCursor?: string
  pageSize?: number
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

  // path should start with a slash
  async create({ file, path }) {
    if (!file || !path) {
      return
    }
    return await this.client.create({
      contents: file,
      path,
    })
  }

  // todo: not implemented yet
  async delete(path) {
    console.info(path)
    await this
    throw new Error('not implemented')
  }

  async getContent(path: string) {
    const result = await this.client.download({ path })
    // @ts-expect-error fileBlob is not declared in dropbox sdk's types
    return result.result.fileBlob
  }

  async getContentAndCache(path: string) {
    const cacheKey = { name: 'DropboxProvider.peekContent', path }
    const blob = await this.getContent(path)

    const text = await blob.text()
    if (typeof text === 'string') {
      RequestCache.set(cacheKey, blob)
    }
    return blob
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
      RequestCache.set({ name: 'DropboxProvider.peek', path }, children)
    }

    return children.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name,
          type: item['.tag'] === 'folder' ? 'directory' : 'file',
        }),
    )
  }

  async peek(path: string) {
    const rawCache = await RequestCache.get({ name: 'DropboxProvider.peek', path })
    const children = rawCache?.value
    const fileAccessors: FileAccessor[] | undefined = children?.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name,
          type: item['.tag'] === 'folder' ? 'directory' : 'file',
        }),
    )
    return fileAccessors
  }

  async peekContent(path: string) {
    const cacheKey = { name: 'DropboxProvider.peekContent', path }
    const rawCache = await RequestCache.get(cacheKey)
    return rawCache?.value
  }

  private async listChildrenByPages(path: string, { pageCursor = '', pageSize = 200 }: ListOptions = {}) {
    const pager = { cursor: '', size: pageSize }
    const params = pageCursor
      ? { cursor: pageCursor }
      : { include_media_info: true, limit: pageSize, path: path === '/' ? '' : path }

    const result = await this.client.list(params)

    const { cursor, entries: items, has_more: hasMore } = result.result
    let listNextPage
    if (hasMore && cursor) {
      pager.cursor = cursor
      listNextPage = async () => await this.listChildrenByPages(path, { pageCursor: pager.cursor })
    }

    return { items, listNextPage, pager }
  }
}
