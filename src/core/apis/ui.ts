import {
  detectLocalHandleExistence,
  detectLocalHandlePermission,
  requestFreshLocalHandle,
  requestLocalHandle,
} from '..'
import { CoreStateManager } from '../classes/core-state-manager'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { Rom } from '../classes/rom'
import { emitter } from '../helpers/emitter'
import { offPressButton, offPressButtons, onPressButton, onPressButtons } from '../helpers/gamepad'
import { globalInstances } from './global-instances'
import { system } from './system'

async function start() {
  const { preference } = globalInstances
  const type = preference.get('romProviderType')
  if (type === 'local') {
    globalInstances.fileSystemProvider = await LocalProvider.getSingleton()
  } else if (type === 'onedrive') {
    globalInstances.fileSystemProvider = await OneDriveProvider.getSingleton()
  }

  emitter.emit('started')
}

let readyToStartEmitted = false
async function emitIfReadyToStart() {
  if (readyToStartEmitted) {
    return
  }
  const steps = await ui.getStepsBeforeStart()
  if (steps.length > 0) {
    return
  }
  if (!system.isPreferenceValid()) {
    return
  }
  emitter.emit('ready-to-start')
  readyToStartEmitted = true
}

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

  async listDirectory(directory: string) {
    const onedrive = await OneDriveProvider.getSingleton()
    return await onedrive.listDir(directory)
  },

  async needGrantPermissionManually() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    if (romProviderType !== 'local') {
      return false
    }

    const steps = await ui.getStepsBeforeStart()
    if (steps.length > 0) {
      return false
    }

    const hasPermission = await detectLocalHandlePermission({ name: 'rom', mode: 'readwrite' })
    return !hasPermission
  },

  async grantPermissionManually() {
    await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
  },

  onOnedriveToken({ start, success, error }) {
    emitter.on('onedrive-token', (event) => {
      switch (event) {
        case 'start':
          start()
          break
        case 'success':
          success()
          break
        case 'error':
          error()
          break
      }
    })
  },

  async setWorkingDirectory(path: string) {
    system.setWorkingDirectory(path)
    await emitIfReadyToStart()
  },

  async start() {
    const steps = await ui.getStepsBeforeStart()

    await (steps.length === 0
      ? start()
      : new Promise<void>((resolve) => {
          emitter.on('ready-to-start', async () => {
            await start()
            resolve()
          })
        }))
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

  onPressButtons,
  onPressButton,
  offPressButton,
  offPressButtons,
}

window.ui = ui
