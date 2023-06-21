import { CoreStateManager } from '../classes/core-state-manager'
import { PreferenceParser } from '../classes/preference-parser'
import { globalContext } from '../internal/global-context'

export async function saveGameState() {
  const { emulator, fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not valid')
  } else if (!emulator) {
    throw new Error('emulator is not valid')
  } else if (!emulator.rom?.name) {
    throw new Error('emulator rom is not valid')
  }

  const state = await emulator.saveState()
  if (emulator && state && fileSystem) {
    const stateDirectory = PreferenceParser.get('stateDirectory')
    if (emulator.core && emulator.rom) {
      const coreStateManager = new CoreStateManager({
        core: emulator.core,
        name: emulator.rom.name,
        directory: stateDirectory,
        fileSystemProvider: fileSystem,
      })
      await coreStateManager.createState(state)
    }
  }
}
