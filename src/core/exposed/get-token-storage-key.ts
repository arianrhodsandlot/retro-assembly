import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import type { CloudService } from '.'

export function getTokenStorageKey(type: CloudService) {
  switch (type) {
    case 'onedrive':
      return OnedriveClient.tokenStorageKey
    case 'google-drive':
      return GoogleDriveClient.tokenStorageKey
    case 'dropbox':
      return DropboxClient.tokenStorageKey
    default:
      throw new Error('invalid token type')
  }
}
