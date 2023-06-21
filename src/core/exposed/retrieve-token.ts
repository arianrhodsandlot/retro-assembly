import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'

export async function retrieveToken(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      await OneDriveProvider.retrieveToken()
      break
    case 'google-drive':
      await GoogleDriveProvider.retrieveToken()
      break
    default:
      throw new Error('invalid token type')
  }
}
