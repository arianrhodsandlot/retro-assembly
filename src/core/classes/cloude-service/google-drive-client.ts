import queryString from 'query-string'
import { Auth } from './auth'
import { type CloudServiceClient } from './cloud-service-client'

const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const hostUrl = `${location.protocol}//${location.host}`

export class GoogleDriveClient extends Auth implements CloudServiceClient {
  static tokenStorageKey = 'google-drive-token'

  protected static config = {
    authorizeUrl: 'https://accounts.google.com/o/oauth2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    clientId: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID,
    clientSecret: import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET,
    scope: 'https://www.googleapis.com/auth/drive',
    redirectUri: `${hostUrl}/auth/google-drive`,
  }

  private static apiKey = import.meta.env.VITE_GOOGLE_DRIVE_API_KEY

  private client: typeof gapi

  constructor() {
    super()
    this.client = gapi
  }

  static async getAuthorizeUrl(): Promise<string> {
    const { codeChallenge, method } = await this.getPkceChanllenge()

    const query = {
      client_id: this.config.clientId,
      scope: this.config.scope,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: method,
      prompt: 'consent',
      access_type: 'offline',
    }
    return queryString.stringifyUrl({ url: this.config.authorizeUrl, query })
  }

  static async loadGapi() {
    await new Promise((resolve) => gapi.load('client', resolve))
    await gapi.client.init({ apiKey: GoogleDriveClient.apiKey, discoveryDocs })
    gapi.client.setToken({ access_token: GoogleDriveClient.getAccessToken() })
  }

  static async validateAccessToken() {
    if (!GoogleDriveClient.getAccessToken()) {
      return false
    }

    await GoogleDriveClient.loadGapi()
    try {
      await gapi.client.drive.files.list({ pageSize: 1, fields: 'files(id)' })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  protected static shouldRefreshToken(error: unknown) {
    return (error as any)?.result?.error?.status === 'UNAUTHENTICATED'
  }

  protected static async refreshToken() {
    await super.refreshToken()
    gapi.client.setToken({ access_token: GoogleDriveClient.getAccessToken() })
  }

  async list(...args: Parameters<typeof gapi.client.drive.files.list>) {
    return await GoogleDriveClient.requestWithRefreshTokenOnError(
      async () => await this.client.client.drive.files.list(...args),
    )
  }

  async create(...args: Parameters<typeof gapi.client.drive.files.create>) {
    return await GoogleDriveClient.requestWithRefreshTokenOnError(
      async () => await this.client.client.drive.files.create(...args),
    )
  }
}
