import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OneDriveProvider } from '../classes/file-system-providers/onedrive-provider'

export function getAuthorizeUrl(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OneDriveProvider.getAuthorizeUrl()
    case 'google-drive':
      return GoogleDriveProvider.getAuthorizeUrl()
    default:
      throw new Error('invalid token type')
  }
}
