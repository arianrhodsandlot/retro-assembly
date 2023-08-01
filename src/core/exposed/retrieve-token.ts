import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import { type CloudService } from '.'

export async function retrieveToken(type: CloudService) {
  switch (type) {
    case 'onedrive':
      await OnedriveClient.retrieveToken()
      break
    case 'google-drive':
      await GoogleDriveClient.retrieveToken()
      break
    case 'dropbox':
      await DropboxClient.retrieveToken()
      break
    default:
      throw new Error('invalid token type')
  }
}
