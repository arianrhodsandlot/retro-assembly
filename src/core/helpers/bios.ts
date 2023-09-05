import { compact } from 'lodash-es'
import { join } from 'path-browserify'
import { PreferenceParser } from '../classes/preference-parser'
import { type Rom } from '../classes/rom'
import { coreBiosMap, systemCoreMap, systemsNeedsBios } from '../constants/systems'
import { globalContext } from '../internal/global-context'
import { getArcadeBiosNames } from './arcade'

export async function getBiosFiles(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  if (!systemsNeedsBios.includes(rom.system)) {
    return
  }

  const core = systemCoreMap[rom.system]

  const biosNames = rom.system === 'arcade' ? getArcadeBiosNames(rom) : coreBiosMap[core]

  const biosFilesRequests = biosNames.map((biosName) => getArcadeBiosFile(biosName))
  const biosFiles = await Promise.all(biosFilesRequests)
  return compact(biosFiles)
}

export async function getArcadeBiosFile(biosName: string) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }
  const romDirectory = PreferenceParser.get('romDirectory')
  const biosDirectory = join(romDirectory, 'system')
  let blob: Blob | undefined
  try {
    blob = await globalContext.fileSystem?.getContent(join(biosDirectory, biosName))
  } catch (error) {
    console.warn(error)
  }
  return blob ? { name: biosName, blob } : undefined
}
