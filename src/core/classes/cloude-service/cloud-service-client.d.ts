import type { AuthConfig } from './auth'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class CloudServiceClient {
  static getAuthorizeUrl: () => string
  static isRetrievingToken: () => boolean
  static retrieveToken: () => Promise<void>
  static validateAccessToken: () => Promise<boolean>
  protected static shouldRefreshToken: (error: unknown) => boolean
  protected static tokenStorageKey: string
  protected static config: AuthConfig
  protected static getAccessToken: () => string
}
