import { GoogleDriveClient } from '../classes/cloude-service/google-drive-client'
import { OnedriveClient } from '../classes/cloude-service/onedrive-client'

export async function detectNeedsLogin(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return !(await OnedriveClient.validateAccessToken())
    case 'google-drive':
      return !(await GoogleDriveClient.validateAccessToken())
    default:
      throw new Error('invalid token type')
  }
}
