// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export abstract class CloudServiceClient {
  static tokenStorageKey: string
  static getAuthorizeUrl: () => string
  static isRetrievingToken: () => boolean
  static retrieveToken: () => Promise<void>
  private static getAccessToken: () => string
}
