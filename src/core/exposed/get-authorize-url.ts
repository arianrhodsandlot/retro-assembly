import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export function getAuthorizeUrl(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OnedriveClient.getAuthorizeUrl()
    case 'google-drive':
      return GoogleDriveClient.getAuthorizeUrl()
    default:
      throw new Error('invalid token type')
  }
}
