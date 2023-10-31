import { join } from 'path-browserify'
import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

export async function peekPlatformRoms(platform: string) {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const platformRomsDirectory = join(romDirectory, platform)
  const files = await fileSystem.peek(platformRomsDirectory)
  if (files) {
    return Rom.fromFileAccessors(files)
  }
}
