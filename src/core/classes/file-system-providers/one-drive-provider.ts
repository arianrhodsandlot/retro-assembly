import { Client } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../../constants/auth'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { FileSummary } from './file-summary'
import { type FileSystemProvider } from './file-system-provider'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

const onedriveApiCacheKey = 'onedrive-api-cache'

let onedriveCloudProvider: OneDriveProvider
export class OneDriveProvider implements FileSystemProvider {
  static tokenRecordStorageKey = 'onedrive-token'
  private client: Client

  private constructor() {
    this.client = Client.init({
      authProvider(done) {
        const accessToken = OneDriveProvider.getAccessToken()
        done(undefined, accessToken)
      },
    })
  }

  static async getSingleton() {
    const accessToken = OneDriveProvider.getAccessToken()
    if (!accessToken) {
      OneDriveProvider.authorize()
      throw new Error('no access token')
    }

    if (onedriveCloudProvider) {
      return onedriveCloudProvider as OneDriveProvider
    }

    const candidate = new OneDriveProvider()
    try {
      await candidate.validateAccessToken()
    } catch (error) {
      OneDriveProvider.authorize()
      throw error
    }
    onedriveCloudProvider = candidate
    window.o = candidate
    return candidate
  }

  static dectectRedirect() {
    if (location.search.includes('code')) {
      OneDriveProvider.getAndPersistToken()
      history.replaceState(undefined, '', '/')
    }
  }

  private static getAccessToken() {
    const tokenRecord = getStorageByKey(OneDriveProvider.tokenRecordStorageKey)
    return tokenRecord?.access_token
  }

  private static authorize() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'code',
      redirect_uri: redirectUri,
      code_challenge: codeChallenge,
    }
    const url = queryString.stringifyUrl({ url: authorizeUrl, query })
    location.assign(url)
  }

  private static async getAndPersistToken() {
    const { code, error, error_description: errorDescription } = queryString.parse(location.search)
    if (error) {
      console.error({ error, errorDescription })
      return
    }
    if (!code || typeof code !== 'string') {
      return
    }
    const result = await ky
      .post(tokenUrl, {
        body: new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          code,
          grant_type: 'authorization_code',
          code_verifier: codeChallenge,
        }),
      })
      .json<any>()
    setStorageByKey({ key: OneDriveProvider.tokenRecordStorageKey, value: result })
  }

  private static async refreshToken() {
    const refreshToken = getStorageByKey(OneDriveProvider.tokenRecordStorageKey).refresh_token
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
    setStorageByKey({ key: OneDriveProvider.tokenRecordStorageKey, value: result })
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

  private static setDirectoryApiCache({ path, size, lastModified, response }) {
    const dirCacheKey = JSON.stringify({ path, size, lastModified })
    const cache = getStorageByKey(onedriveApiCacheKey) || {}
    cache[dirCacheKey] = response
    setStorageByKey({ key: onedriveApiCacheKey, value: cache })
  }

  private static getDirectoryApiCache({ path, size, lastModified }) {
    const dirCacheKey = JSON.stringify({ path, size, lastModified })
    const cache = getStorageByKey(onedriveApiCacheKey)
    const result = cache?.[dirCacheKey]
    if (result) {
      return result
    }
  }

  async getFileContent(path: string) {
    const request = this.client.api(`/me/drive/root:${path}`)
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await OneDriveProvider.wrapRequest(() => request.get())
    return await ky(downloadUrl).blob()
  }

  async listDirFilesRecursively(path: string) {
    const list = async ({ path, size, lastModified }: { path: string; size?: number; lastModified?: string }) => {
      if (size !== undefined && lastModified !== undefined) {
        const cache = OneDriveProvider.getDirectoryApiCache({ path, size, lastModified })
        if (cache) {
          return cache
        }
      }

      const response: FileSummary[] = []
      const children = await this.listDir(path)
      for (const child of children) {
        const childParentPath = decodeURIComponent(child.parentReference.path.replace(/^\/drive\/root:/, ''))
        const path = `${childParentPath}/${child.name}`
        if (child.folder?.childCount) {
          const listResponse = await list({ path, size: child.size, lastModified: child.lastModifiedDateTime })
          response.push(...listResponse)
        } else if (child.file) {
          const downloadUrl = child['@microsoft.graph.downloadUrl']
          const fileSummary = new FileSummary({
            path,
            downloadUrl,
            getBlob: async () => await this.getFileContent(path),
          })
          response.push(fileSummary)
        }
      }

      OneDriveProvider.setDirectoryApiCache({ path, size, lastModified, response })

      return response
    }

    return await list({ path })
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

  async listDir(path) {
    const children: any[] = []

    let apiPath = !path || path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`

    // "top" means page size
    let top = 200
    let token = ''
    do {
      const request = this.client.api(apiPath).top(top).skipToken(token)
      const result = await OneDriveProvider.wrapRequest(() => request.get())
      children.push(...result.value)

      const nextLink = result['@odata.nextLink']
      if (nextLink) {
        const { url, query } = queryString.parseUrl(nextLink)
        apiPath = new URL(url).pathname.replace('/v1.0', '')
        token = query.$skipToken ? `${query.$skipToken}` : ''
        top = Number.parseInt(`${query.$top}`, 10) ?? top
      } else {
        apiPath = ''
      }
    } while (apiPath)

    return children
  }

  private async validateAccessToken() {
    try {
      await this.client.api('/me/drive').get()
    } catch (error) {
      console.warn(error)
      throw error
    }
  }
}
