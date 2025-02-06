import queryString from 'query-string'
import { getScript } from '../../helpers/misc'
import { Auth } from './auth'
import type { CloudServiceClient } from './cloud-service-client'

const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const hostUrl = `${location.protocol}//${location.host}`

export class GoogleDriveClient extends Auth implements CloudServiceClient {
  static readonly tokenStorageKey = 'google-drive-token'

  protected static config = {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
    clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET,
    redirectUri: `${hostUrl}/auth/google-drive`,
    scope: ['https://www.googleapis.com/auth/drive'],
    tokenUrl: 'https://oauth2.googleapis.com/token',
  }

  private static apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY

  private client: typeof gapi

  constructor() {
    super()
    if (!('gapi' in globalThis)) {
      throw new Error('gapi is not available')
    }
    this.client = gapi
  }

  static async getAuthorizeUrl(): Promise<string> {
    const { codeChallenge, method } = await this.getPkceChanllenge()

    const query = {
      access_type: 'offline',
      client_id: this.config.clientId,
      code_challenge: codeChallenge,
      code_challenge_method: method,
      prompt: 'consent',
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
    }
    return queryString.stringifyUrl({ query, url: this.config.authorizeUrl })
  }

  static async loadGapi() {
    if (!('gapi' in globalThis)) {
      await getScript('https://apis.google.com/js/api.js')
    }
    if (!gapi.client) {
      await new Promise((resolve) => {
        gapi.load('client', resolve)
      })
    }
    if (!gapi.client.getToken()) {
      gapi.client.setToken({ access_token: GoogleDriveClient.getAccessToken() })
    }
    if (!gapi.client.drive) {
      await gapi.client.init({ apiKey: GoogleDriveClient.apiKey, discoveryDocs })
    }
  }

  static async validateAccessToken() {
    if (!GoogleDriveClient.getAccessToken()) {
      return false
    }

    await GoogleDriveClient.loadGapi()
    try {
      await gapi.client.drive.files.list({ fields: 'files(id)', pageSize: 1 })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  protected static async refreshToken() {
    await super.refreshToken()
    gapi.client.setToken({ access_token: GoogleDriveClient.getAccessToken() })
  }

  protected static shouldRefreshToken(error: unknown) {
    return (error as any)?.result?.error?.status === 'UNAUTHENTICATED'
  }

  async create(...args: Parameters<typeof gapi.client.drive.files.create>) {
    return await GoogleDriveClient.requestWithRefreshTokenOnError(
      async () => await this.client.client.drive.files.create(...args),
    )
  }

  async list(...args: Parameters<typeof gapi.client.drive.files.list>) {
    return await GoogleDriveClient.requestWithRefreshTokenOnError(
      async () => await this.client.client.drive.files.list(...args),
    )
  }
}
