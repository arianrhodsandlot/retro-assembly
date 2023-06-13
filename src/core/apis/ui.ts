import { filter } from 'lodash-es'
import { GoogleDriveProvider, detectLocalHandleExistence, systemNamesSorted } from '..'
import { CoreStateManager } from '../classes/core-state-manager'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { Rom } from '../classes/rom'
import { offPressButton, offPressButtons, onPressButton, onPressButtons } from '../helpers/gamepad'
import { globalInstances } from './global-instances'
import { system } from './system'

async function getStepsBeforeStart() {
  const steps: string[] = []
  const { preference } = globalInstances

  if (!system.isPreferenceValid()) {
    steps.push('preference')
  }

  const romProviderType = preference.get('romProviderType')

  if (romProviderType === 'local') {
    const localHandleExist = await detectLocalHandleExistence('rom')
    if (!localHandleExist) {
      steps.push('prepare')
    }
  }

  if (romProviderType === 'onedrive') {
    const isAccessTokenValid = await OneDriveProvider.validateAccessToken()
    if (!isAccessTokenValid) {
      steps.push('prepare')
    }
  }

  return steps
}

let getStepsBeforeStartPromise
async function getStepsBeforeStartWithCache() {
  if (getStepsBeforeStartPromise) {
    return await getStepsBeforeStartPromise
  }
  getStepsBeforeStartPromise = getStepsBeforeStart()
  const steps = await getStepsBeforeStartPromise
  getStepsBeforeStartPromise = undefined
  return steps
}

export const ui = {
  getStepsBeforeStart: getStepsBeforeStartWithCache,

  async listDirectory({ path, type }: { path: string; type: 'onedrive' | 'google-drive' }) {
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
  },

  async listRoms() {
    const { fileSystemProvider, preference } = globalInstances
    const romDirectory = preference.get('romDirectory')
    const files = await fileSystemProvider.listFilesRecursively(romDirectory)
    const roms = Rom.fromFiles(files)
    return Rom.groupBySystem(roms)
  },

  async validateRomsDirectory(pathOrHandle: string | FileSystemDirectoryHandle) {
    let directories

    if (typeof pathOrHandle === 'string') {
      const onedrive = OneDriveProvider.getSingleton()

      const children = await onedrive.listChildren(pathOrHandle)
      directories = filter(children, 'isDirectory')
    }

    if (pathOrHandle instanceof FileSystemDirectoryHandle) {
      const local = LocalProvider.getSingleton({ handle: pathOrHandle })
      const children = await local.listChildren()
      directories = filter(children, 'isDirectory')
    }

    return directories.some((directory) => systemNamesSorted.includes(directory.name))
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

  onPressButtons,
  onPressButton,
  offPressButton,
  offPressButtons,

  onConfirm(callback: () => void) {
    onPressButton('a', callback)
  },

  offConfirm(callback: () => void) {
    offPressButton('a', callback)
  },

  onCancel(callback: () => void) {
    onPressButton('b', callback)
  },

  offCancel(callback: () => void) {
    offPressButton('b', callback)
  },
}

window.ui = ui
