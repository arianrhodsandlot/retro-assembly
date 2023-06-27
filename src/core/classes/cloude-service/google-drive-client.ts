import queryString from 'query-string'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { type CloudServiceClient } from './cloud-service-client'

const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const hostUrl = `${location.protocol}//${location.host}`
const googleDriveAuth = {
  clientId: '274532033666-qenp1uucqj33b57qphiojlc47198q972.apps.googleusercontent.com',
  projectId: 'retro-assembly',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  redirectUri: `${hostUrl}/auth/googledrive`,
  javascript_origins: [hostUrl],
  scope: 'https://www.googleapis.com/auth/drive',
}

const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

const { clientId, scope, redirectUri } = googleDriveAuth
const apiKey = 'AIzaSyDPqjP2pwqA_ZgYcGwm3P336qEMUNssmsY'

export class GoogleDriveClient implements CloudServiceClient {
  static tokenStorageKey = 'google-drive-token'
  private client: typeof gapi

  constructor() {
    this.client = gapi
  }

  static getAuthorizeUrl() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'token',
      redirect_uri: redirectUri,
    }
    return queryString.stringifyUrl({ url: authorizeUrl, query })
  }

  static isRetrievingAccessToken() {
    const { access_token: accessToken } = queryString.parse(location.hash)
    return typeof accessToken === 'string'
  }

  static retrieveToken() {
    if (!GoogleDriveClient.isRetrievingAccessToken()) {
      throw new TypeError('token is empty')
    }

    const { access_token: accessToken, error, error_description: errorDescription } = queryString.parse(location.hash)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof accessToken === 'string') {
      setStorageByKey({ key: GoogleDriveClient.tokenStorageKey, value: { access_token: accessToken } })
    } else {
      throw new TypeError(`invalide code. code: ${accessToken}`)
    }
  }

  static async loadGapi() {
    await new Promise((resolve) => gapi.load('client', resolve))
    await gapi.client.init({ apiKey, discoveryDocs })
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

  private static getAccessToken() {
    const tokenRecord = getStorageByKey(GoogleDriveClient.tokenStorageKey)
    return tokenRecord?.access_token
  }

  async list(...args: Parameters<typeof gapi.client.drive.files.list>) {
    return await this.client.client.drive.files.list(...args)
  }

  async create(...args: Parameters<typeof gapi.client.drive.files.create>) {
    return await this.client.client.drive.files.create(...args)
  }
}
