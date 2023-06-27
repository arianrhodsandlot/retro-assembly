import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export async function retrieveToken(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      await OnedriveClient.retrieveToken()
      break
    case 'google-drive':
      await GoogleDriveClient.retrieveToken()
      break
    default:
      throw new Error('invalid token type')
  }
}
