import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { path } from '../helpers/vendors'
import { globalContext } from '../internal/global-context'

export async function peekPlatformRoms(platform: string) {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const platformRomsDirectory = path.join(romDirectory, platform)
  const files = await fileSystem.peek(platformRomsDirectory)
  if (files) {
    return Rom.fromFileAccessors(files)
  }
}
