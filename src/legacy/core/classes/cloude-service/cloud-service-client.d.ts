import type { AuthConfig } from './auth'

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class CloudServiceClient {
  static readonly getAuthorizeUrl: () => string
  static readonly isRetrievingToken: () => boolean
  static readonly retrieveToken: () => Promise<void>
  static readonly validateAccessToken: () => Promise<boolean>
  protected static config: AuthConfig
  protected static getAccessToken: () => string
  protected static shouldRefreshToken: (error: unknown) => boolean
  protected static tokenStorageKey: string
}
