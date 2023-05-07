import { CoreStateManager } from '../classes/core-state-manager'
import { Emulator } from '../classes/emulator'
import { type Rom } from '../classes/rom'
import { globalInstances } from './global-instances'

function ensureStarted() {
  if (!globalInstances.fileSystemProvider) {
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
    const emulator = new Emulator({ rom, style: emulatorStyle })
    emulator.launch()
    globalInstances.emulator = emulator
  },

  async loadState(stateId) {
    const { emulator, fileSystemProvider } = globalInstances
    if (!emulator) {
      throw new Error('Could not load state. Make sure game.launch has been called.')
    }

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
    const { emulator } = globalInstances
    emulator.start()
  },

  pause() {
    const { emulator } = globalInstances
    emulator.pause()
  },

  fullscreen() {
    const { emulator } = globalInstances
    emulator.emscripten.Module.requestFullscreen()
  },

  async saveState() {
    const { emulator } = globalInstances
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
    const { emulator } = globalInstances
    emulator.exit()
    globalInstances.emulator = undefined
  },
}
