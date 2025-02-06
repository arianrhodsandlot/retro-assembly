import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import type { CloudService } from '.'

export async function detectNeedsLogin(type: CloudService) {
  switch (type) {
    case 'dropbox':
      return !(await DropboxClient.validateAccessToken())
    case 'google-drive':
      return !(await GoogleDriveClient.validateAccessToken())
    case 'onedrive':
      return !(await OnedriveClient.validateAccessToken())
    default:
      throw new Error('invalid token type')
  }
}
