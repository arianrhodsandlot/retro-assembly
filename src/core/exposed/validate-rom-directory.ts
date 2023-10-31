import { filter } from 'lodash-es'
import { DropboxProvider } from '../classes/file-system-providers/dropbox-provider'
import { type FileAccessor } from '../classes/file-system-providers/file-accessor'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OnedriveProvider } from '../classes/file-system-providers/onedrive-provider'
import { platformNamesSorted } from '../constants/platforms'
import { type CloudService } from '.'

interface ValidateRomDirectoryParamsForLocalType {
  type: 'local'
  handle: FileSystemDirectoryHandle
}

interface ValidateRomDirectoryParamsForCloudServiceType {
  type: CloudService
  directory: string
}

type ValidateRomDirectoryParams = ValidateRomDirectoryParamsForLocalType | ValidateRomDirectoryParamsForCloudServiceType

export async function validateRomDirectory(params: ValidateRomDirectoryParams) {
  const { type } = params
  let directories: FileAccessor[]

  switch (type) {
    case 'onedrive': {
      const { directory } = params
      const onedrive = OnedriveProvider.getSingleton()
      const children = await onedrive.list(directory)
      directories = filter(children, 'isDirectory')
      break
    }
    case 'google-drive': {
      const { directory } = params
      const googleDrive = await GoogleDriveProvider.getSingleton()
      const children = await googleDrive.list(directory)
      directories = filter(children, 'isDirectory')
      break
    }
    case 'dropbox': {
      const { directory } = params
      const dropboxProvider = DropboxProvider.getSingleton()
      const children = await dropboxProvider.list(directory)
      directories = filter(children, 'isDirectory')
      break
    }
    case 'local': {
      const { handle } = params
      const local = LocalProvider.getSingleton({ handle })
      const children = await local.list()
      directories = filter(children, 'isDirectory')
      break
    }
    default:
      throw new Error('invalid type:', type)
  }

  return directories.some((directory) => (platformNamesSorted as string[]).includes(directory.name))
}
