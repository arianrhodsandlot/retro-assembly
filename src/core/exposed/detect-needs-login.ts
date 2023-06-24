import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OneDriveProvider } from '../classes/file-system-providers/onedrive-provider'

export async function detectNeedsLogin(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return !(await OneDriveProvider.validateAccessToken())
    case 'google-drive':
      return !(await GoogleDriveProvider.validateAccessToken())
    default:
      throw new Error('invalid token type')
  }
}
