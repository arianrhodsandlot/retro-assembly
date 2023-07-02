import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OnedriveProvider } from '../classes/file-system-providers/onedrive-provider'

export async function listDirectory({ path, type }: { path: string; type: 'onedrive' | 'google-drive' }) {
  switch (type) {
    case 'onedrive': {
      const onedrive = await OnedriveProvider.getSingleton()
      return await onedrive.list(path)
    }
    case 'google-drive': {
      const googleDrive = await GoogleDriveProvider.getSingleton()
      return await googleDrive.list(path)
    }
    default:
      throw new Error('invalid token type:', type)
  }
}
