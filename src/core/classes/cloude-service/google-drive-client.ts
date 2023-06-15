import queryString from 'query-string'

const discoveryDocs = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
const googleDriveAuth = {
  clientId: '274532033666-qenp1uucqj33b57qphiojlc47198q972.apps.googleusercontent.com',
  projectId: 'retro-assembly',
  authUri: 'https://accounts.google.com/o/oauth2/auth',
  tokenUri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  redirectUri: 'http://localhost:5173/auth/googledrive',
  javascript_origins: ['http://localhost:5173'],
  scope: 'https://www.googleapis.com/auth/drive',
}

const authorizeUrl = 'https://accounts.google.com/o/oauth2/v2/auth'

const { clientId, scope, redirectUri } = googleDriveAuth
const apiKey = 'AIzaSyDPqjP2pwqA_ZgYcGwm3P336qEMUNssmsY'

export class GoogleDriveClient {
  private accessToken: string

  private constructor({ accessToken }) {
    this.accessToken = accessToken
  }

  async getInstance() {
    await this.loadGapi()
  }

  async loadGapi() {
    await new Promise((resolve) => gapi.load('client', resolve))
    await gapi.client.init({ apiKey, discoveryDocs })
    gapi.client.setToken({ access_token: this.accessToken })
  }

  getAuthorizeUrl() {
    const query = {
      client_id: clientId,
      scope,
      response_type: 'token',
      redirect_uri: redirectUri,
    }
    return queryString.stringifyUrl({ url: authorizeUrl, query })
  }

  isRetrievingAccessToken() {
    const { access_token: accessToken } = queryString.parse(location.hash)
    return typeof accessToken === 'string'
  }

  retrieveToken() {
    if (!this.isRetrievingAccessToken()) {
      throw new TypeError('token is empty')
    }

    const { access_token: accessToken, error, error_description: errorDescription } = queryString.parse(location.hash)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof accessToken === 'string') {
      this.accessToken = accessToken
    } else {
      throw new TypeError(`invalide code. code: ${accessToken}`)
    }
  }

  async validateAccessToken() {
    if (!this.accessToken) {
      return false
    }

    await this.loadGapi()
    try {
      await gapi.client.drive.files.list({ pageSize: 1, fields: 'files(id)' })
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }
}
