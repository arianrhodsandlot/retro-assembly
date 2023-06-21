import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

export async function getSystemRoms(system) {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const files = await fileSystem.listChildren(`${romDirectory}${system}/`)
  return Rom.fromFileAccessors(files)
}
