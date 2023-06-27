import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'

export function getTokenStorageKey(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OnedriveClient.tokenStorageKey
    case 'google-drive':
      return GoogleDriveProvider.tokenStorageKey
    default:
      throw new Error('invalid token type')
  }
}
