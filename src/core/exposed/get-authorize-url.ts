import { DropboxClient } from '../classes/cloude-service/dropbox-client'
import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export async function getAuthorizeUrl(type: 'onedrive' | 'google-drive' | 'dropbox') {
  switch (type) {
    case 'onedrive':
      return await OnedriveClient.getAuthorizeUrl()
    case 'google-drive':
      return await GoogleDriveClient.getAuthorizeUrl()
    case 'dropbox':
      return await DropboxClient.getAuthorizeUrl()
    default:
      throw new Error('invalid token type')
  }
}
