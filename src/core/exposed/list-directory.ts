import { DropboxProvider } from '../classes/file-system-providers/dropbox-provider'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { OnedriveProvider } from '../classes/file-system-providers/onedrive-provider'
import type { CloudService } from '.'

export async function listDirectory({ path, type }: { path: string; type: CloudService }) {
  switch (type) {
    case 'onedrive': {
      const onedrive = OnedriveProvider.getSingleton()
      return await onedrive.list(path)
    }
    case 'google-drive': {
      const googleDrive = await GoogleDriveProvider.getSingleton()
      return await googleDrive.list(path)
    }
    case 'dropbox': {
      const dropboxProvider = DropboxProvider.getSingleton()
      return await dropboxProvider.list(path)
    }
    default:
      throw new Error('invalid token type:', type)
  }
}
