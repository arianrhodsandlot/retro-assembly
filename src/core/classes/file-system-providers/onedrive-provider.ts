import { Client } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../../constants/auth'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { FileAccessor } from './file-accessor'
import { type FileSystemProvider } from './file-system-provider'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

interface ListOptions {
  pageSize?: number
  pageCursor?: string
  orderBy?: string
}

let onedriveCloudProvider: OneDriveProvider
export class OneDriveProvider implements FileSystemProvider {
  static tokenStorageKey = 'onedrive-token'
  private static cacheIndexedDb: any
  private client: Client

  private constructor() {
    this.client = OneDriveProvider.getClient()
  }

  static getSingleton() {
    if (onedriveCloudProvider) {
      return onedriveCloudProvider as OneDriveProvider
    }

    onedriveCloudProvider = new OneDriveProvider()
    return onedriveCloudProvider
  }

  static isRetrievingToken() {
    const { code } = queryString.parse(location.search)
    return typeof code === 'string'
  }

  static async retrieveToken() {
    const isRetrievingToken = OneDriveProvider.isRetrievingToken()
    if (!isRetrievingToken) {
      throw new TypeError('code is empty')
    }

    const { code, error, error_description: errorDescription } = queryString.parse(location.search)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof code === 'string') {
      const grantType = 'authorization_code'
      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        code,
        grant_type: grantType,
        code_verifier: codeChallenge,
      }
      const body = new URLSearchParams(params)
      const result = await ky.post(tokenUrl, { body }).json<any>()
      setStorageByKey({ key: OneDriveProvider.tokenStorageKey, value: result })
    } else {
      throw new TypeError(`invalide code. code: ${code}`)
    }
  }

  static async validateAccessToken() {
    if (!OneDriveProvider.getAccessToken()) {
      return false
    }

    const client = OneDriveProvider.getClient()
    const request = client.api('/me')
    try {
      await OneDriveProvider.wrapRequest(() => request.get())
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  static getAuthorizeUrl() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
    }
    return queryString.stringifyUrl({ url: authorizeUrl, query })
  }

  private static getAccessToken() {
    const tokenRecord = getStorageByKey(OneDriveProvider.tokenStorageKey)
    return tokenRecord?.access_token
  }

  private static getClient() {
    return Client.init({
      authProvider(done) {
        const accessToken = OneDriveProvider.getAccessToken()
        done(undefined, accessToken)
      },
    })
  }

  private static async refreshToken() {
    const refreshToken = getStorageByKey(OneDriveProvider.tokenStorageKey).refresh_token
    if (!refreshToken) {
      return
    }
    const result = await ky
      .post(tokenUrl, {
        body: new URLSearchParams({
          client_id: clientId,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
          code_verifier: codeChallenge,
        }),
      })
      .json<any>()
    setStorageByKey({ key: OneDriveProvider.tokenStorageKey, value: result })
  }

  private static async wrapRequest(request: any) {
    try {
      return await request()
    } catch (error: any) {
      if (error.code === 'InvalidAuthenticationToken') {
        await OneDriveProvider.refreshToken()
        return await request()
      }
      throw error
    }
  }

  async getFileContent(path: string) {
    const request = this.client.api(`/me/drive/root:${path}`)
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await OneDriveProvider.wrapRequest(() => request.get())
    return await ky(downloadUrl).blob()
  }

  // path should start with a slash
  async createFile({ file, path }) {
    if (!file || !path) {
      return
    }
    const request = this.client.api(`/me/drive/root:${path}:/content`)
    await OneDriveProvider.wrapRequest(() => request.put(file))
  }

  async deleteFile(path: string) {
    if (!path) {
      return
    }
    const request = this.client.api(`/me/drive/root:${path}`)
    await OneDriveProvider.wrapRequest(() => request.delete())
  }

  async listChildren(path: string) {
    // if (options) {
    //   return await this.listByPages(path, options)
    // }

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
    const request = this.client.api(apiPath).top(pageSize).skipToken(pageCursor).orderby(orderBy)
    const result = await OneDriveProvider.wrapRequest(() => request.get())

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
      pager.cursor = query.$skipToken ? `${query.$skipToken}` : ''
      listNextPage = async () => {
        return await this.listByPages(path, { pageSize: pager.size, pageCursor: pager.cursor, orderBy })
      }
    }

    return {
      items: fileAccessors,
      pager,
      listNextPage,
    }
  }
}
