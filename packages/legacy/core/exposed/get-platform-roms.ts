import { PreferenceParser } from '../classes/preference-parser'
import { Rom } from '../classes/rom'
import { path } from '../helpers/vendors'
import { globalContext } from '../internal/global-context'

export async function getPlatformRoms(platform: string) {
  const { fileSystem, isDemoRunning } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = isDemoRunning ? '' : PreferenceParser.get('romDirectory')
  const platformRomsDirectory = path.join(romDirectory, platform)
  const files = await fileSystem.list(platformRomsDirectory)
  return Rom.fromFileAccessors(files)
}
