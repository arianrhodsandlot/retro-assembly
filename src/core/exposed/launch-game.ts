import { filter, includes } from 'lodash-es'
import { join } from 'path-browserify'
import { Emulator } from '../classes/emulator'
import { FileAccessor } from '../classes/file-system-providers/file-accessor'
import { PreferenceParser } from '../classes/preference-parser'
import { type Rom } from '../classes/rom'
import { coreBiosMap, systemCoreMap } from '../constants/systems'
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
  const core = systemCoreMap[rom.system]
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const knownBiosFiles = coreBiosMap[core]
  if (!knownBiosFiles) {
    return
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const biosDirectory = join(romDirectory, 'system')
  let allBiosFileAccessors: FileAccessor[] = []
  try {
    allBiosFileAccessors = await globalContext.fileSystem.list(biosDirectory)
  } catch (error) {
    console.warn(error)
  }
  const biosFileAccessors = filter(allBiosFileAccessors, ({ name }) => includes(knownBiosFiles, name))
  const biosFiles = await Promise.all(
    biosFileAccessors.map(async (biosFileAccessor) => {
      try {
        const blob = await biosFileAccessor.getBlob()
        return { name: biosFileAccessor.name, blob }
      } catch {}
    }),
  )
  return biosFiles.filter(Boolean)
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
