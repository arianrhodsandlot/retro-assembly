import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'

export function getTokenStorageKey(type: 'onedrive' | 'google-drive') {
  switch (type) {
    case 'onedrive':
      return OneDriveProvider.tokenStorageKey
    case 'google-drive':
      return GoogleDriveProvider.tokenStorageKey
    default:
      throw new Error('invalid token type')
  }
}
