import { Client } from '@microsoft/microsoft-graph-client'
import { openDB } from 'idb'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../../constants/auth'
import { emitter } from '../../helpers/emitter'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { FileSummary } from './file-summary'
import { type FileSystemProvider } from './file-system-provider'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

const cacheDbName = 'cache'
const cacheDbVersion = 1
const onedriveApiCacheKey = 'onedrive-api-cache'

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

  static authorize() {
    location.assign(OneDriveProvider.getAuthorizeUrl())
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
        try {
          await OneDriveProvider.refreshToken()
          return await request()
        } catch {
          emitter.emit('request-auth-error', { type: 'onedrive', error })
        }
      }
      throw error
    }
  }

  private static async setDirectoryApiCache({ path, size, lastModified, response }) {
    OneDriveProvider.cacheIndexedDb ??= openDB(cacheDbName, cacheDbVersion, {
      upgrade(database) {
        database
          .createObjectStore(onedriveApiCacheKey, { keyPath: 'id', autoIncrement: true })
          .createIndex('path', 'path')
      },
    })

    const database = await OneDriveProvider.cacheIndexedDb

    await database.add(onedriveApiCacheKey, { path, size, lastModified, response })
  }

  private static async getDirectoryApiCache({ path, size, lastModified }) {
    OneDriveProvider.cacheIndexedDb ??= openDB(cacheDbName, cacheDbVersion, {
      upgrade(database) {
        database
          .createObjectStore(onedriveApiCacheKey, { keyPath: 'id', autoIncrement: true })
          .createIndex('path', 'path')
      },
    })
    const database = await OneDriveProvider.cacheIndexedDb
    const rows = await database.getAllFromIndex(onedriveApiCacheKey, 'path', path)
    for (const row of rows) {
      if (row && row.size === size && row.lastModified === lastModified) {
        return row.response
      }
    }
  }

  async getFileContent(path: string) {
    const request = this.client.api(`/me/drive/root:${path}`)
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await OneDriveProvider.wrapRequest(() => request.get())
    return await ky(downloadUrl).blob()
  }

  async listFilesRecursively(path: string) {
    const list = async ({ path, size, lastModified }: { path: string; size?: number; lastModified?: string }) => {
      const shouldUseCache = size !== undefined && lastModified !== undefined

      if (shouldUseCache) {
        const cache = await OneDriveProvider.getDirectoryApiCache({ path, size, lastModified })
        if (cache) {
          return cache
        }
      }

      const children = await this.listChildren(path)

      const files = children
        .filter((child) => child.raw.file)
        .map((child) => {
          const childParentPath = decodeURIComponent(child.raw.parentReference.path.replace(/^\/drive\/root:/, ''))
          const path = `${childParentPath}/${child.name}`
          return { path, downloadUrl: child['@microsoft.graph.downloadUrl'] }
        })

      const foldersPromises = children
        .filter((child) => child.raw.folder?.childCount)
        .map((child) => {
          const childParentPath = decodeURIComponent(child.raw.parentReference.path.replace(/^\/drive\/root:/, ''))
          const path = `${childParentPath}/${child.name}`
          return list({ path, size: child.raw.size, lastModified: child.raw.lastModifiedDateTime })
        })

      const folders = await Promise.all(foldersPromises)
      const response = [...files, ...folders.flat()]

      if (shouldUseCache) {
        await OneDriveProvider.setDirectoryApiCache({ path, size, lastModified, response })
      }
      return response
    }

    const response = await list({ path })

    return response.map(
      (fileSummaryObj) =>
        new FileSummary({ ...fileSummaryObj, getBlob: async () => await this.getFileContent(fileSummaryObj.path) })
    )
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

  async listChildren(path = '/') {
    const children: any[] = []

    let apiPath = !path || path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`

    // "top" means page size
    let top = 200
    let token = ''
    do {
      const request = this.client.api(apiPath).top(top).skipToken(token)
      const result = await OneDriveProvider.wrapRequest(() => request.get())
      children.push(
        ...result.value.map((item) => ({
          name: item.name,
          isDirectory: 'folder' in item,
          isFile: 'file' in item,
          raw: item,
        }))
      )

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
}
