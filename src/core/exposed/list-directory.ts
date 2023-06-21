import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'

export async function listDirectory({ path, type }: { path: string; type: 'onedrive' | 'google-drive' }) {
  switch (type) {
    case 'onedrive': {
      const onedrive = await OneDriveProvider.getSingleton()
      return await onedrive.listChildren(path)
    }
    case 'google-drive': {
      const googleDrive = await GoogleDriveProvider.getSingleton()
      return await googleDrive.listChildren(path)
    }
    default:
      throw new Error('invalid token type:', type)
  }
}
