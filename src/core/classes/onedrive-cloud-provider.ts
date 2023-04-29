import { Client } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { oneDriveAuth } from '../constants/auth'
import { getJson, replaceJson, updateJson } from '../helpers/local-storage'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

let onedriveCloudProvider
export class OneDriveCloudProvider {
  client: Client

  constructor() {
    this.client = Client.init({
      authProvider(done) {
        done(undefined, getJson('onedrive').access_token)
      },
      fetchOptions: {
        redirect: 'manual',
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
    const refreshToken = getJson('onedrive').access_token
    if (!refreshToken) {
      return
    }
    const result = await ky
      .post(tokenUrl, {
        body: new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          grant_type: 'refresh_token',
          code_verifier: codeChallenge,
          refresh_token: refreshToken,
        }),
      })
      .json<any>()
    updateJson('onedrive', result)
  }

  async download(path: string) {
    const { '@microsoft.graph.downloadUrl': downloadUrl } = await this.client.api(`/me/drive/root:${path}`).get()
    return await ky(downloadUrl).blob()
  }

  async listDir(path = '/') {
    if (path === '/') {
      return await this.client.api('/me/drive/root/children').get()
    }
    return await this.client.api(`/me/drive/root:${path}:/children`).get()
  }

  private dectectRedirect() {
    if (location.search.includes('code')) {
      OneDriveCloudProvider.getToken()
    }
  }
}
