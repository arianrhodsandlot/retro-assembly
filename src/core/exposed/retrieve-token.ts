import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import type { CloudService } from '.'

export async function retrieveToken(type: CloudService) {
  switch (type) {
    case 'dropbox':
      await DropboxClient.retrieveToken()
      break
    case 'google-drive':
      await GoogleDriveClient.retrieveToken()
      break
    case 'onedrive':
      await OnedriveClient.retrieveToken()
      break
    default:
      throw new Error('invalid token type')
  }
}
