import { DemoProvider } from '../classes/file-system-providers/demo-provider'
import { DropboxProvider } from '../classes/file-system-providers/dropbox-provider'
import { GoogleDriveProvider } from '../classes/file-system-providers/google-drive-provider'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OnedriveProvider } from '../classes/file-system-providers/onedrive-provider'
import { PreferenceParser } from '../classes/preference-parser'
import { globalContext } from '../internal/global-context'

export async function start() {
  const type = PreferenceParser.get('romProviderType')
  switch (type) {
    case 'demo':
      globalContext.fileSystem = DemoProvider.getSingleton()
      break
    case 'local':
      globalContext.fileSystem = LocalProvider.getSingleton()
      break
    case 'onedrive':
      globalContext.fileSystem = OnedriveProvider.getSingleton()
      break
    case 'google-drive':
      globalContext.fileSystem = await GoogleDriveProvider.getSingleton()
      break
    case 'dropbox':
      globalContext.fileSystem = DropboxProvider.getSingleton()
      break
    default:
      throw new Error('unknown rom provider type')
  }
}
