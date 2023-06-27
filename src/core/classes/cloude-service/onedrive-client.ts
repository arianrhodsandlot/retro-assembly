import { Client, type GraphRequest } from '@microsoft/microsoft-graph-client'
import ky from 'ky'
import queryString from 'query-string'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'
import { type CloudServiceClient } from './cloud-service-client'

const authorizeUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
const tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token'

const oneDriveAuth = {
  clientId: '2c4631a1-bd21-4437-a502-49f841c25367',
  scope: 'offline_access Files.ReadWrite.All Files.ReadWrite.AppFolder',
  redirectUri: `${location.protocol}//${location.host}/auth/onedrive`,
  codeChallenge: 'YTFjNjI1OWYzMzA3MTI4ZDY2Njg5M2RkNmVjNDE5YmEyZGRhOGYyM2IzNjdmZWFhMTQ1ODg3NDcxY2Nl',
}

const { clientId, scope, redirectUri, codeChallenge } = oneDriveAuth

export class OnedriveClient implements CloudServiceClient {
  static tokenStorageKey = 'onedrive-token'
  private client: Client

  constructor() {
    this.client = OnedriveClient.getClient()
  }

  static isRetrievingToken() {
    const { code } = queryString.parse(location.search)
    return typeof code === 'string'
  }

  static async retrieveToken() {
    const isRetrievingToken = OnedriveClient.isRetrievingToken()
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
      setStorageByKey({ key: OnedriveClient.tokenStorageKey, value: result })
    } else {
      throw new TypeError(`invalide code. code: ${code}`)
    }
  }

  static async validateAccessToken() {
    if (!OnedriveClient.getAccessToken()) {
      return false
    }

    const client = OnedriveClient.getClient()
    const request = client.api('/me')
    try {
      await OnedriveClient.wrapRequest(() => request.get())
    } catch (error) {
      console.warn(error)
      return false
    }
    return true
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

  static getClient() {
    return Client.init({
      authProvider(done) {
        const accessToken = OnedriveClient.getAccessToken()
        done(undefined, accessToken)
      },
    })
  }

  static async wrapRequest(request: any) {
    try {
      return await request()
    } catch (error: any) {
      if (error.code === 'InvalidAuthenticationToken') {
        await OnedriveClient.refreshToken()
        return await request()
      }
      throw error
    }
  }

  private static getAccessToken() {
    const tokenRecord = getStorageByKey(OnedriveClient.tokenStorageKey)
    return tokenRecord?.access_token
  }

  private static async refreshToken() {
    const refreshToken = getStorageByKey(OnedriveClient.tokenStorageKey).refresh_token
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
    setStorageByKey({ key: OnedriveClient.tokenStorageKey, value: result })
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
    return await OnedriveClient.wrapRequest(() => request[method](content))
  }
}
