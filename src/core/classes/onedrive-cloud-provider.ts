import { Client } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../constants/auth'
import { getJson, replaceJson, updateJson } from '../helpers/local-storage'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

interface RemoteFile {
  name: string
  dir: string
  path: string
}

interface CloudProvider {
  downloadFile: (path: string) => Promise<Blob>
  listDirFilesRecursely: (path: string) => Promise<RemoteFile[]>
}

let onedriveCloudProvider
export class OneDriveCloudProvider implements CloudProvider {
  client: Client

  constructor() {
    this.client = Client.init({
      authProvider(done) {
        done(undefined, getJson('onedrive').access_token)
      },
    })

    this.dectectRedirect()
  }

  static get() {
    if (onedriveCloudProvider) {
      return onedriveCloudProvider as OneDriveCloudProvider
    }
    onedriveCloudProvider = new OneDriveCloudProvider()
    return onedriveCloudProvider as OneDriveCloudProvider
  }

  static authorize() {
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

  static async getToken() {
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
    replaceJson('onedrive', result)
  }

  static async refreshToken() {
    const refreshToken = getJson('onedrive').refresh_token
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
    updateJson('onedrive', result)
  }

  private static async wrapRequest(request: any) {
    try {
      return await request()
    } catch (error: any) {
      if (error.code === 'InvalidAuthenticationToken') {
        await OneDriveCloudProvider.refreshToken()
        return await request()
      }
      throw error
    }
  }

  async downloadFile(path: string) {
    const request = this.client.api(`/me/drive/root:${path}`)
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await OneDriveCloudProvider.wrapRequest(() => request.get())
    return await ky(downloadUrl).blob()
  }

  async listDirFilesRecursely(path: string) {
    if (localStorage.remoteFiles) {
      return JSON.parse(localStorage.remoteFiles)
    }
    const files: RemoteFile[] = []

    const list = async (path: string) => {
      const children = await this.listDir(path)
      for (const child of children) {
        if (child.folder?.childCount) {
          const childParentPath = child.parentReference.path.replace(/^\/drive\/root:/, '')
          const childPath = `${childParentPath}/${child.name}`
          await list(childPath)
        } else if (child.file) {
          const dir = child.parentReference.path.replace(/^\/drive\/root:/, '')
          files.push({ name: child.name, path: `${dir}/${child.name}`, dir })
        }
      }
    }

    await list(path)

    return files
  }

  private async listDir(path = '/') {
    const children: any[] = []

    let apiPath = path === '/' ? '/me/drive/root/children' : `/me/drive/root:${path}:/children`
    let skipToken = ''
    let top = 200
    do {
      const request = this.client.api(apiPath).top(top).skipToken(skipToken)
      const result = await OneDriveCloudProvider.wrapRequest(() => request.get())
      children.push(...result.value)

      const nextLink = result['@odata.nextLink']
      if (nextLink) {
        const { url, query } = queryString.parseUrl(nextLink)
        apiPath = new URL(url).pathname.replace('/v1.0', '')
        skipToken = query.$skipToken ? `${query.$skipToken}` : ''
        top = Number.parseInt(`${query.$top}`, 10) ?? top
      } else {
        apiPath = ''
      }
    } while (apiPath)

    return children
  }

  private dectectRedirect() {
    if (location.search.includes('code')) {
      OneDriveCloudProvider.getToken()
    }
  }
}
