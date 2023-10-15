import type { Dropbox, files } from 'dropbox'
import { Auth } from './auth'
import type { CloudServiceClient } from './cloud-service-client'

const hostUrl = `${location.protocol}//${location.host}`
export class DropboxClient extends Auth implements CloudServiceClient {
  static tokenStorageKey = 'dropbox-token'
  protected static config = {
    clientId: import.meta.env.VITE_DROPBOX_CLIENT_ID,
    scope: ['files.content.read', 'files.content.write', 'files.metadata.read'],
    tokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    redirectUri: `${hostUrl}/auth/dropbox`,
  }

  static async getAuthorizeUrl(): Promise<string> {
    const { DropboxAuth } = await import('dropbox')
    const dropboxAuth = new DropboxAuth({
      clientId: DropboxClient.config.clientId,
    })
    const { codeChallenge, method } = await this.getPkceChanllenge()

    const { redirectUri, scope } = DropboxClient.config
    let authenticationUrl = await dropboxAuth.getAuthenticationUrl(redirectUri, undefined, 'code', 'offline', scope)
    authenticationUrl += `&code_challenge_method=${method}`
    authenticationUrl += `&code_challenge=${codeChallenge}`
    return `${authenticationUrl}`
  }

  static async validateAccessToken() {
    if (!DropboxClient.getAccessToken()) {
      return false
    }

    try {
      await DropboxClient.requestWithRefreshTokenOnError(async () => {
        const client = await DropboxClient.getClient()
        return await client.filesListFolder({ path: '', limit: 1 })
      })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  protected static shouldRefreshToken(error: unknown) {
    // @ts-expect-error in fact its DropboxResponseError
    return error?.error?.error_summary === 'invalid_access_token/'
  }

  private static async getClient() {
    const { Dropbox, DropboxAuth } = await import('dropbox')
    const accessToken = DropboxClient.getAccessToken()

    if (accessToken) {
      const auth = new DropboxAuth({ clientId: DropboxClient.config.clientId, accessToken })
      return new Dropbox({ clientId: DropboxClient.config.clientId, auth })
    }

    return new Dropbox({ clientId: DropboxClient.config.clientId })
  }

  async list(
    params: files.ListFolderArg | files.ListFolderContinueArg,
  ): ReturnType<Dropbox['filesListFolder']> | ReturnType<Dropbox['filesListFolderContinue']> {
    return await DropboxClient.requestWithRefreshTokenOnError(async () => {
      const client = await DropboxClient.getClient()
      if ('cursor' in params) {
        return await client.filesListFolderContinue(params)
      }
      return await client.filesListFolder(params)
    })
  }

  async create(params: files.UploadArg) {
    return await DropboxClient.requestWithRefreshTokenOnError(async () => {
      const client = await DropboxClient.getClient()
      return await client.filesUpload({
        mode: { '.tag': 'overwrite' },
        mute: true,
        ...params,
      })
    })
  }

  async download(params: files.DownloadArg): ReturnType<Dropbox['filesDownload']> {
    return await DropboxClient.requestWithRefreshTokenOnError(async () => {
      const client = await DropboxClient.getClient()

      return await client.filesDownload(params)
    })
  }
}
