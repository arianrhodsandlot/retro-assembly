import { CoreStateManager } from '../classes/core-state-manager'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { Rom } from '../classes/rom'
import { offPressButton, offPressButtons, onPressButton, onPressButtons } from '../helpers/gamepad'
import { globalInstances } from './global-instances'

export const ui = {
  async start() {
    const { preference } = globalInstances
    const type = preference.get('romProviderType')

    if (type === 'local') {
      globalInstances.fileSystemProvider = await LocalProvider.getSingleton()
    } else if (type === 'onedrive') {
      globalInstances.fileSystemProvider = await OneDriveProvider.getSingleton()
    }
  },

  async listRoms() {
    const { fileSystemProvider } = globalInstances
    // const romDirectory = preference.get('romDirectory')
    const romDirectory = ''
    const files = await fileSystemProvider.listDirFilesRecursely(romDirectory)
    const roms = Rom.fromFiles(files)
    return Rom.groupBySystem(roms)
  },

  async listStates() {
    const { emulator, preference, fileSystemProvider } = globalInstances
    // const stateDirectory = preference.get('stateDirectory')
    const stateDirectory = 'retro-assembly/states/'
    const coreStateManager = new CoreStateManager({
      core: emulator.core,
      name: emulator.rom?.fileSummary?.name,
      directory: stateDirectory,
      fileSystemProvider,
    })
    return await coreStateManager.getStates()
  },

  onPressButtons,
  onPressButton,
  offPressButton,
  offPressButtons,
}
