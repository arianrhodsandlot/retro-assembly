import ky from 'ky'
import queryString from 'query-string'
import { OnedriveClient } from '../cloude-service/onedrive-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

interface ListOptions {
  pageSize?: number
  pageCursor?: string
  orderBy?: string
}

let onedriveCloudProvider: OnedriveProvider

export class OnedriveProvider implements FileSystemProvider {
  private client: OnedriveClient

  private constructor() {
    this.client = new OnedriveClient()
  }

  static getSingleton() {
    if (onedriveCloudProvider) {
      return onedriveCloudProvider as OnedriveProvider
    }

    onedriveCloudProvider = new OnedriveProvider()
    return onedriveCloudProvider
  }

  async getContent(path: string) {
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await this.client.request({ api: `/me/drive/root:${path}` })
    return await ky(downloadUrl).blob()
  }

  // path should start with a slash
  async create({ file, path }) {
    if (!file || !path) {
      return
    }
    return await this.client.request({
      api: `/me/drive/root:${path}:/content`,
      method: 'put',
      content: file,
    })
  }

  async delete(path: string) {
    if (!path) {
      return
    }
    return await this.client.request({
      api: `/me/drive/root:${path}`,
      method: 'delete',
    })
  }

  async list(path: string) {
    const children: { name: string; folder?: unknown }[] = []
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
          type: 'folder' in item ? 'directory' : 'file',
          fileSystemProvider: this,
        })
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
          type: 'folder' in item ? 'directory' : 'file',
          fileSystemProvider: this,
        })
    )
    return fileAccessors
  }

  private async listChildrenByPages(
    path: string,
    { pageSize = 200, pageCursor = '', orderBy = 'name' }: ListOptions = {}
  ) {
    const apiPath = !path || path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`
    const result = await this.client.request({ api: apiPath, top: pageSize, skipToken: pageCursor, orderby: orderBy })
    const items: { name: string; folder?: unknown }[] = result.value
    const pager = { size: pageSize, cursor: '' }
    const nextLink = result['@odata.nextLink']
    let listNextPage
    if (nextLink) {
      const { query } = queryString.parseUrl(nextLink)
      pager.size = Number.parseInt(`${query.$top}`, 10) ?? pageSize
      const skipToken = query.$skiptoken || query.$skipToken
      if (skipToken) {
        pager.cursor = skipToken.toString()
        listNextPage = async () =>
          await this.listChildrenByPages(path, { pageSize: pager.size, pageCursor: pager.cursor, orderBy })
      }
    }

    return {
      items,
      pager,
      listNextPage,
    }
  }
}
