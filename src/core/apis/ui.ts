import { detectLocalHandleExistence, requestLocalHandle } from '..'
import { CoreStateManager } from '../classes/core-state-manager'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { Rom } from '../classes/rom'
import { offPressButton, offPressButtons, onPressButton, onPressButtons } from '../helpers/gamepad'
import { globalInstances } from './global-instances'
import { system } from './system'

export const ui = {
  async getStepsBeforeStart() {
    const steps: string[] = []
    const { preference } = globalInstances

    if (!system.validatePreference() || !globalInstances.preference) {
      steps.push('preference')
    }

    if (preference.get('romProviderType') === 'local') {
      const localHandleExist = await detectLocalHandleExistence('rom')
      if (!localHandleExist) {
        steps.push('local-directory-select')
      }
    }

    if (preference.get('romProviderType') === 'onedrive') {
      const isAccessTokenValid = await OneDriveProvider.validateAccessToken()
      if (!isAccessTokenValid) {
        steps.push('onedrive-authorize')
      }
    }

    return steps
  },

  // this function should be called when user interacts with the webpage, and all other ui methods should be called after this.
  async setup() {
    const { preference } = globalInstances
    const type = preference.get('romProviderType')

    if (type === 'local') {
      await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
      system.setWorkingDirectory('')
    } else if (type === 'onedrive') {
      OneDriveProvider.authorize()
    }
  },

  async regrantLocalPermision() {
    const handle = await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
    console.log(handle)
  },

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
    const { fileSystemProvider, preference } = globalInstances
    const romDirectory = preference.get('romDirectory')
    const files = await fileSystemProvider.listDirFilesRecursively(romDirectory)
    const roms = Rom.fromFiles(files)
    return Rom.groupBySystem(roms)
  },

  async listStates() {
    const { preference, emulator, fileSystemProvider } = globalInstances
    const stateDirectory = preference.get('stateDirectory')
    const coreStateManager = new CoreStateManager({
      core: emulator.core,
      name: emulator.rom?.fileSummary?.name,
      directory: stateDirectory,
      fileSystemProvider,
    })
    return await coreStateManager.getStates()
  },

  async listDirectory(directory: string) {
    await ui.start()
    const { fileSystemProvider } = globalInstances
    return await fileSystemProvider.listDir(directory)
  },

  onPressButtons,
  onPressButton,
  offPressButton,
  offPressButtons,
}

window.ui = ui
