import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export async function detectNeedsLogin(type: 'onedrive' | 'google-drive' | 'dropbox') {
  switch (type) {
    case 'onedrive':
      return !(await OnedriveClient.validateAccessToken())
    case 'google-drive':
      return !(await GoogleDriveClient.validateAccessToken())
    case 'dropbox':
      return !(await DropboxClient.validateAccessToken())
    default:
      throw new Error('invalid token type')
  }
}
