import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'

export async function retrieveToken(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      await OnedriveClient.retrieveToken()
      break
    case 'google-drive':
      await GoogleDriveProvider.retrieveToken()
      break
    default:
      throw new Error('invalid token type')
  }
}
