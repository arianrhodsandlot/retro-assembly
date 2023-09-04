import { compact } from 'lodash-es'
import { join } from 'path-browserify'
import { Emulator } from '../classes/emulator'
import { PreferenceParser } from '../classes/preference-parser'
import { type Rom } from '../classes/rom'
import { arcadeHardwareBiosMap, coreBiosMap, systemCoreMap } from '../constants/systems'
import { emitter } from '../internal/emitter'
import { globalContext } from '../internal/global-context'
import { exitGame } from './exit-game'

export async function launchGame(
  rom: Rom,
  { waitForUserInteraction }: { waitForUserInteraction?: () => Promise<void> } = {},
) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  await rom.ready()

  try {
    exitGame()
  } catch {}

  const [biosFiles, additionalFiles] = await Promise.all([getBiosFiles(rom), getAdditionalFiles(rom)])

  const emulator = new Emulator({ rom, biosFiles, additionalFiles })
  globalContext.emulator = emulator
  await emulator.launch(waitForUserInteraction)
  emitter.emit('launched', rom)
}

async function getBiosFiles(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const core = systemCoreMap[rom.system]
  const knownBiosFiles = coreBiosMap[core]
  if (!knownBiosFiles) {
    return
  }
  const hardware = rom.arcadeGameInfo?.hardware
  if (!hardware) {
    return
  }
  const biosNames = arcadeHardwareBiosMap[hardware]
  if (!biosNames) {
    return
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const biosDirectory = join(romDirectory, 'system')

  const biosFilesRequests = biosNames.map(async (biosName) => {
    let blob: Blob | undefined
    try {
      blob = await globalContext.fileSystem?.getContent(join(biosDirectory, biosName))
    } catch (error) {
      console.warn(error)
    }
    return blob ? { name: biosName, blob } : undefined
  })
  const biosFiles = await Promise.all(biosFilesRequests)
  return compact(biosFiles)
}

async function getAdditionalFiles(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const { arcadeGameInfo, system } = rom
  if (arcadeGameInfo?.parent) {
    const parentFileName = `${arcadeGameInfo.parent}.zip`
    const romDirectory = PreferenceParser.get('romDirectory')
    const parentFilePath = join(romDirectory, system, parentFileName)
    try {
      const blob = await globalContext.fileSystem.getContent(parentFilePath)
      return [{ name: parentFileName, blob }]
    } catch {
      return []
    }
  }
}
