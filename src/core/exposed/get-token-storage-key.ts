import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export function getTokenStorageKey(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OnedriveClient.tokenStorageKey
    case 'google-drive':
      return GoogleDriveClient.tokenStorageKey
    default:
      throw new Error('invalid token type')
  }
}
