import { join } from 'path-browserify'
import { PreferenceParser } from '../classes/preference-parser'
import { type Rom } from '../classes/rom'
import { arcadeHardwareBiosMap } from '../constants/platforms'
import { globalContext } from '../internal/global-context'

export function getArcadeBiosNames(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const defaultNames: string[] = []

  const hardware = rom.arcadeGameInfo?.hardware
  if (!hardware) {
    return defaultNames
  }
  const biosNames = arcadeHardwareBiosMap[hardware]
  if (!biosNames) {
    return defaultNames
  }
  return biosNames
}

export async function getAdditionalFiles(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const { arcadeGameInfo, platform } = rom
  if (arcadeGameInfo?.parent) {
    const parentFileName = `${arcadeGameInfo.parent}.zip`
    const romDirectory = PreferenceParser.get('romDirectory')
    const parentFilePath = join(romDirectory, platform, parentFileName)
    try {
      const blob = await globalContext.fileSystem.getContent(parentFilePath)
      return [{ name: parentFileName, blob }]
    } catch {
      return []
    }
  }
}
