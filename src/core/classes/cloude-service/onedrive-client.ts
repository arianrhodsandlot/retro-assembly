import type { Client, GraphRequest } from '@microsoft/microsoft-graph-client'
import queryString from 'query-string'
import { Auth } from './auth'
import type { CloudServiceClient } from './cloud-service-client'

const hostUrl = `${location.protocol}//${location.host}`
export class OnedriveClient extends Auth implements CloudServiceClient {
  static readonly tokenStorageKey = 'onedrive-token'
  protected static config = {
    authorizeUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    clientId: import.meta.env.VITE_ONEDRIVE_CLIENT_ID,
    redirectUri: `${hostUrl}/auth/onedrive`,
    scope: ['offline_access', 'Files.ReadWrite.All'],
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  }

  private client: Client | Promise<Client>

  constructor() {
    super()
    this.client = OnedriveClient.getClient()
  }

  static async getAuthorizeUrl(): Promise<string> {
    const { codeChallenge, method } = await this.getPkceChanllenge()

    const query = {
      client_id: this.config.clientId,
      code_challenge: codeChallenge,
      code_challenge_method: method,
      redirect_uri: this.config.redirectUri,
      response_type: 'code',
      scope: this.config.scope.join(' '),
    }
    return queryString.stringifyUrl({ query, url: this.config.authorizeUrl })
  }

  static async validateAccessToken() {
    if (!OnedriveClient.getAccessToken()) {
      return false
    }

    const client = await OnedriveClient.getClient()
    const request = client.api('/me/drive/root/children').top(1)
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

  private static async getClient() {
    const { Client } = await import('@microsoft/microsoft-graph-client')
    return Client.init({
      authProvider(done) {
        const accessToken = OnedriveClient.getAccessToken()
        if (!accessToken) {
          throw new Error('invalid token')
        }
        done(undefined, accessToken)
      },
    })
  }

  async request({
    api,
    content,
    method = 'get',
    orderby,
    skipToken,
    top,
  }: {
    api: Parameters<Client['api']>[0]
    content?: unknown
    method?: string
    orderby?: Parameters<GraphRequest['orderby']>[0]
    skipToken?: Parameters<GraphRequest['skipToken']>[0]
    top?: Parameters<GraphRequest['top']>[0]
  }) {
    const client = await this.client
    let request = client.api(api)
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
