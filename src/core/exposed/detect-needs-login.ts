import { OnedriveClient } from '../classes/cloude-service/onedrive-client'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'

export async function detectNeedsLogin(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return !(await OnedriveClient.validateAccessToken())
    case 'google-drive':
      return !(await GoogleDriveProvider.validateAccessToken())
    default:
      throw new Error('invalid token type')
  }
}
