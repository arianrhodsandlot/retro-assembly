import ky from 'ky'
import queryString from 'query-string'
import { generatePKCEChallenge } from '../../helpers/pkce'
import { getStorageByKey, setStorageByKey } from '../../helpers/storage'

export interface AuthConfig {
  authorizeUrl: string
  tokenUrl: string
  clientId: string
  clientSecret?: string
  scope: string
  redirectUri: string
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class Auth {
  protected static tokenStorageKey: string
  protected static config: AuthConfig

  static async retrieveToken() {
    const isRetrievingToken = this.isRetrievingToken()
    if (!isRetrievingToken) {
      throw new TypeError('code is empty')
    }

    const { code, error, error_description: errorDescription } = queryString.parse(location.search)
    if (error) {
      throw new Error(`error: ${error}, error description: ${errorDescription}`)
    } else if (typeof code === 'string') {
      const { codeVerifier } = getStorageByKey('pkce-chanllenge') ?? ''
      const grantType = 'authorization_code'
      const params = {
        client_id: this.config.clientId,
        redirect_uri: this.config.redirectUri,
        code,
        grant_type: grantType,
        code_verifier: codeVerifier,
      }

      // Since Google does not support PKCE authorization yet, though we don't want to expose our client secret, we have to.
      // see https://stackoverflow.com/q/76528208 https://stackoverflow.com/q/60724690 https://stackoverflow.com/q/19615372
      if (this.config.clientSecret) {
        Object.assign(params, { client_secret: this.config.clientSecret })
      }

      const body = new URLSearchParams(params)
      try {
        const result = await ky.post(this.config.tokenUrl, { body }).json<any>()
        setStorageByKey({ key: this.tokenStorageKey, value: result })
      } catch {
        throw new TypeError(`invalide code. code: ${code}`)
      }
    } else {
      throw new TypeError(`invalide code. code: ${code}`)
    }
  }

  protected static getAccessToken() {
    const tokenRecord = getStorageByKey(this.tokenStorageKey)
    return tokenRecord?.access_token
  }

  protected static async getPkceChanllenge() {
    const storageChanllenge = getStorageByKey('pkce-chanllenge') ?? {}
    if (storageChanllenge.codeVerifier && storageChanllenge.codeChallenge) {
      return storageChanllenge
    }

    const chanllenge = await generatePKCEChallenge()
    setStorageByKey({ key: 'pkce-chanllenge', value: chanllenge })
    return chanllenge
  }

  protected static shouldRefreshToken(error: unknown) {
    return !!error
  }

  protected static async requestWithRefreshTokenOnError(request: () => Promise<any>): Promise<any> {
    try {
      return await request()
    } catch (error: any) {
      if (this.shouldRefreshToken(error)) {
        await this.refreshToken()
        return await request()
      }
      throw error
    }
  }

  protected static async refreshToken() {
    const tokenStorage = getStorageByKey(this.tokenStorageKey)
    const refreshToken = tokenStorage.refresh_token
    if (!refreshToken) {
      return
    }

    const params = {
      client_id: this.config.clientId,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }

    // Since Google does not support PKCE authorization yet, though we don't want to expose our client secret, we have to.
    // see https://stackoverflow.com/q/76528208 https://stackoverflow.com/q/60724690 https://stackoverflow.com/q/19615372
    if (this.config.clientSecret) {
      Object.assign(params, { client_secret: this.config.clientSecret })
    }

    const body = new URLSearchParams(params)
    const result = await ky.post(this.config.tokenUrl, { body }).json<any>()
    setStorageByKey({ key: this.tokenStorageKey, value: { ...tokenStorage, ...result } })
  }

  private static isRetrievingToken() {
    const { code } = queryString.parse(location.search)
    return typeof code === 'string'
  }
}
