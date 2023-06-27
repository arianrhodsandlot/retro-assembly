import ky from 'ky'
import queryString from 'query-string'
import { OnedriveClient } from '../cloude-service/onedrive-client'
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

  async getFileContent(path: string) {
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await this.client.request({ api: `/me/drive/root:${path}` })
    return await ky(downloadUrl).blob()
  }

  // path should start with a slash
  async createFile({ file, path }) {
    if (!file || !path) {
      return
    }
    return await this.client.request({
      api: `/me/drive/root:${path}:/content`,
      method: 'put',
      content: file,
    })
  }

  async deleteFile(path: string) {
    if (!path) {
      return
    }
    return await this.client.request({
      api: `/me/drive/root:${path}`,
      method: 'delete',
    })
  }

  async listChildren(path: string) {
    const fileAccessors: FileAccessor[] = []
    let listNextPage = async () => await this.listByPages(path, {})
    do {
      const result = await listNextPage()
      fileAccessors.push(...result.items)
      listNextPage = result.listNextPage
    } while (listNextPage)

    return fileAccessors
  }

  async listByPages(path: string, { pageSize = 200, pageCursor = '', orderBy = 'name' }: ListOptions = {}) {
    const apiPath = !path || path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`
    const result = await this.client.request({
      api: apiPath,
      top: pageSize,
      skipToken: pageCursor,
      orderby: orderBy,
    })

    const children: { name: string; folder?: unknown }[] = result.value
    const fileAccessors: FileAccessor[] = children.map(
      (item) =>
        new FileAccessor({
          name: item.name,
          directory: path,
          type: 'folder' in item ? 'directory' : 'file',
          fileSystemProvider: this,
        })
    )

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
          await this.listByPages(path, { pageSize: pager.size, pageCursor: pager.cursor, orderBy })
      }
    }

    return {
      items: fileAccessors,
      pager,
      listNextPage,
    }
  }
}
