import { CoreStateManager } from '../classes/core-state-manager'
import { PreferenceParser } from '../classes/preference-parser'
import { globalContext } from '../internal/global-context'

export async function getStates() {
  const { emulator, fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not valid')
  } else if (!emulator) {
    throw new Error('emulator is not valid')
  } else if (!emulator.rom?.fileAccessor.name) {
    throw new Error('emulator rom is not valid')
  }

  const stateDirectory = PreferenceParser.get('stateDirectory')

  const coreStateManager = new CoreStateManager({
    core: emulator.core,
    name: emulator.rom.fileAccessor.name,
    directory: stateDirectory,
    fileSystemProvider: fileSystem,
  })

  return await coreStateManager.getStates()
}
