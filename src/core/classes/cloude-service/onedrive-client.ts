import { Client, type GraphRequest } from '@microsoft/microsoft-graph-client'
import queryString from 'query-string'
import { Auth } from './auth'
import { type CloudServiceClient } from './cloud-service-client'

const hostUrl = `${location.protocol}//${location.host}`
export class OnedriveClient extends Auth implements CloudServiceClient {
  protected static tokenStorageKey = 'onedrive-token'
  protected static config = {
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID,
    scope: 'offline_access Files.ReadWrite.All Files.ReadWrite.AppFolder',
    redirectUri: `${hostUrl}/auth/onedrive`,
  }

  private client: Client

  constructor() {
    super()
    this.client = OnedriveClient.getClient()
  }

  static async getAuthorizeUrl(): Promise<string> {
    const { codeChallenge } = await this.getPkceChanllenge()

    const query = {
      client_id: this.config.clientId,
      scope: this.config.scope,
      response_type: 'code',
      redirect_uri: this.config.redirectUri,
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    }
    return queryString.stringifyUrl({ url: this.config.authorizeUrl, query })
  }

  static async validateAccessToken() {
    if (!OnedriveClient.getAccessToken()) {
      return false
    }

    const client = OnedriveClient.getClient()
    const request = client.api('/me')
    try {
      await OnedriveClient.requestWithRefreshTokenOnError(() => request.get())
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
  }

  protected static shouldRefreshToken(error: unknown) {
    return (error as any)?.code === 'InvalidAuthenticationToken'
  }

  private static getClient() {
    return Client.init({
      authProvider(done) {
        const accessToken = OnedriveClient.getAccessToken()
        done(undefined, accessToken)
      },
    })
  }

  async request({
    api,
    method = 'get',
    top,
    skipToken,
    orderby,
    content,
  }: {
    api: Parameters<Client['api']>[0]
    method?: string
    top?: Parameters<GraphRequest['top']>[0]
    skipToken?: Parameters<GraphRequest['skipToken']>[0]
    orderby?: Parameters<GraphRequest['orderby']>[0]
    content?: unknown
  }) {
    let request = this.client.api(api)
    if (top) {
      request = request.top(top)
    }
    if (skipToken) {
      request = request.skipToken(skipToken)
    }
    if (orderby) {
      request = request.orderby(orderby)
    }

    function sendRequest() {
      return request[method](content)
    }

    return await OnedriveClient.requestWithRefreshTokenOnError(sendRequest)
  }
}
