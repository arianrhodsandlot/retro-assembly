import { CoreStateManager } from '../classes/core-state-manager'
import { PreferenceParser } from '../classes/preference-parser'
import { globalContext } from '../internal/global-context'

export async function loadGameState(stateId: string) {
  const { emulator, fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not valid')
  }
  if (!emulator) {
    throw new Error('emulator is not valid')
  }
  if (!emulator.rom?.fileAccessor.name) {
    throw new Error('emulator rom is not valid')
  }

  const stateDirectory = PreferenceParser.get('stateDirectory')
  const coreStateManager = new CoreStateManager({
    core: emulator.core,
    directory: stateDirectory,
    fileSystemProvider: fileSystem,
    name: emulator.rom?.fileAccessor?.name,
  })
  const state = await coreStateManager.getStateContent(stateId)
  emulator.loadState(state)
}
