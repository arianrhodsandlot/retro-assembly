import queryString from 'query-string'
import { http } from '../../helpers/http'
import { OnedriveClient } from '../cloude-service/onedrive-client'
import { RequestCache } from '../request-cache'
import { FileAccessor } from './file-accessor'
import type { FileSystemProvider } from './file-system-provider'

interface ListOptions {
  orderBy?: string
  pageCursor?: string
  pageSize?: number
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

  // path should start with a slash
  async create({ file, path }) {
    return await this.client.request({
      api: `/me/drive/root:${path}:/content`,
      content: file,
      method: 'put',
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

  async getContent(path: string) {
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await this.client.request({ api: `/me/drive/root:${path}` })
    return await http(downloadUrl).blob()
  }

  async getContentAndCache(path: string) {
    const cacheKey = { name: 'OnedriveProvider.peekContent', path }
    const blob = await this.getContent(path)

    const text = await blob.text()
    if (typeof text === 'string') {
      RequestCache.set(cacheKey, blob)
    }
    return blob
  }

  async list(path: string) {
    const children: { folder?: unknown; name: string }[] = []
    let listNextPage = async () => await this.listChildrenByPages(path, {})
    do {
      const result = await listNextPage()
      children.push(...result.items)
      listNextPage = result.listNextPage
    } while (listNextPage)

    if (children?.length) {
      RequestCache.set({ name: 'OnedriveProvider.peek', path }, children)
    }

    return children.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name,
          type: 'folder' in item ? 'directory' : 'file',
        }),
    )
  }

  async peek(path: string) {
    const rawCache = await RequestCache.get({ name: 'OnedriveProvider.peek', path })
    const children = rawCache?.value
    const fileAccessors: FileAccessor[] | undefined = children?.map(
      (item) =>
        new FileAccessor({
          directory: path,
          fileSystemProvider: this,
          name: item.name,
          type: 'folder' in item ? 'directory' : 'file',
        }),
    )
    return fileAccessors
  }

  async peekContent(path: string) {
    const cacheKey = { name: 'OnedriveProvider.peekContent', path }
    const rawCache = await RequestCache.get(cacheKey)
    return rawCache?.value
  }

  private async listChildrenByPages(
    path: string,
    { orderBy = 'name', pageCursor = '', pageSize = 200 }: ListOptions = {},
  ) {
    const apiPath = !path || path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`
    const result = await this.client.request({ api: apiPath, orderby: orderBy, skipToken: pageCursor, top: pageSize })
    const items: { folder?: unknown; name: string }[] = result.value
    const pager = { cursor: '', size: pageSize }
    const nextLink = result['@odata.nextLink']
    let listNextPage
    if (nextLink) {
      const { query } = queryString.parseUrl(nextLink)
      pager.size = Number.parseInt(`${query.$top}`, 10) ?? pageSize
      const skipToken = query.$skiptoken || query.$skipToken
      if (skipToken) {
        pager.cursor = skipToken.toString()
        listNextPage = async () =>
          await this.listChildrenByPages(path, { orderBy, pageCursor: pager.cursor, pageSize: pager.size })
      }
    }

    return {
      items,
      listNextPage,
      pager,
    }
  }
}
