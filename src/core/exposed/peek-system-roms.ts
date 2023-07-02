import { join } from 'path-browserify'
import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

export async function peekSystemRoms(system: string) {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const systemRomsDirectory = join(romDirectory, system)
  const files = await fileSystem.peek(systemRomsDirectory)
  if (files) {
    return Rom.fromFileAccessors(files)
  }
}
