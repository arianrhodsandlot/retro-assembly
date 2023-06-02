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
  async launch(rom: Rom) {
    ensureStarted()
    const emulator = new Emulator({ rom })
    await emulator.launch()
    globalInstances.emulator = emulator
  },

  async loadState(stateId) {
    const { emulator, fileSystemProvider, preference } = globalInstances
    if (!emulator) {
      throw new Error('Could not load state. Make sure game.launch has been called.')
    }

    const stateDirectory = preference.get('stateDirectory')
    const coreStateManager = new CoreStateManager({
      core: emulator.core,
      name: emulator.rom?.fileSummary?.name,
      directory: stateDirectory,
      fileSystemProvider,
    })
    const state = await coreStateManager.getStateContent(stateId)
    emulator.loadState(state)
    game.start()
  },

  isRunning() {
    const { emulator } = globalInstances
    return Boolean(emulator)
  },

  start() {
    const { emulator } = globalInstances
    emulator?.start()
  },

  pause() {
    const { emulator } = globalInstances
    emulator?.pause()
  },

  fullscreen() {
    const { emulator } = globalInstances
    emulator?.emscripten.Module.requestFullscreen()
  },

  async saveState() {
    const { emulator, preference, fileSystemProvider } = globalInstances
    const state = await emulator?.saveState()
    if (emulator && state && fileSystemProvider) {
      const stateDirectory = preference.get('stateDirectory')
      if (emulator.core && emulator.rom) {
        const coreStateManager = new CoreStateManager({
          core: emulator.core,
          name: emulator.rom.fileSummary.name,
          directory: stateDirectory,
          fileSystemProvider,
        })
        await coreStateManager.createState(state)
      }
    }
  },

  exit() {
    const { emulator } = globalInstances
    emulator?.exit()
    globalInstances.emulator = undefined
  },
}
