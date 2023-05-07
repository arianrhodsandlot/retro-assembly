import { CoreStateManager } from './classes/core-state-manager'
import { Emulator } from './classes/emulator'
import { type FileSystemProvider } from './classes/file-system-providers/file-system-provider'
import { LocalProvider } from './classes/file-system-providers/local-provider'
import { OneDriveProvider } from './classes/file-system-providers/one-drive-provider'
import { Preference } from './classes/preference'
import { Rom } from './classes/rom'
import { offPressButton, offPressButtons, onPressButton, onPressButtons } from './helpers/gamepad'

let fileSystemProvider: FileSystemProvider
let emulator: Emulator

const preference = new Preference()

function ensureStarted() {
  if (!fileSystemProvider) {
    throw new Error('Could not list roms now. Make sure ui.start() has been called.')
  }
}

export const game = {
  launch(rom: Rom) {
    ensureStarted()

    const emulatorStyle: Partial<CSSStyleDeclaration> = {
      position: 'absolute',
      top: '0',
      left: '0',
      background: 'black',
      zIndex: '20',
    }
    emulator = new Emulator({ rom, style: emulatorStyle })
    emulator.launch()
  },

  async loadState(stateId) {
    // const stateDirectory = preference.get('stateDirectory')
    const stateDirectory = 'retro-assembly/states/'
    const coreStateManager = new CoreStateManager({
      core: emulator.core,
      name: emulator.rom?.fileSummary?.name,
      directory: stateDirectory,
      fileSystemProvider,
    })
    const state = await coreStateManager.getStateContent(stateId)
    game.start()
    emulator.loadState(state)
  },

  start() {
    emulator.start()
  },

  pause() {
    emulator.pause()
  },

  fullscreen() {
    emulator.emscripten.Module.requestFullscreen()
  },

  async saveState() {
    const state = await emulator.saveState()
    if (state) {
      // const stateDirectory = preference.get('stateDirectory')
      const stateDirectory = 'retro-assembly/states/'
      const coreStateManager = new CoreStateManager({
        core: emulator.core,
        name: emulator.rom?.fileSummary.name,
        directory: stateDirectory,
        fileSystemProvider,
      })
      await coreStateManager.createState(state)
    }
  },

  exit() {
    emulator.exit()
    emulator = undefined
  },
}

export const ui = {
  async start() {
    const type = preference.get('romProviderType')

    if (type === 'local') {
      fileSystemProvider = await LocalProvider.getSingleton()
    } else if (type === 'onedrive') {
      fileSystemProvider = await OneDriveProvider.getSingleton()
    }
  },

  async listRoms() {
    ensureStarted()
    // const romDirectory = preference.get('romDirectory')
    const romDirectory = ''
    const files = await fileSystemProvider.listDirFilesRecursely(romDirectory)
    const roms = Rom.fromFiles(files)
    return Rom.groupBySystem(roms)
  },

  async listStates() {
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

export const system = {
  preference,
}

OneDriveProvider.dectectRedirect()
window.game = game
window.ui = ui
window.system = system
