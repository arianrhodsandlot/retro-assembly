import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'

export function getAuthorizeUrl(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OnedriveClient.getAuthorizeUrl()
    case 'google-drive':
      return GoogleDriveProvider.getAuthorizeUrl()
    default:
      throw new Error('invalid token type')
  }
}
