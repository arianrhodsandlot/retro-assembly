import { join } from 'path-browserify'
import { Emulator } from '../classes/emulator'
import { PreferenceParser } from '../classes/preference-parser'
import { type Rom } from '../classes/rom'
import { getAdditionalFiles } from '../helpers/arcade'
import { getBiosFiles } from '../helpers/bios'
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

  const [biosFiles, additionalFiles, emulatorConfig] = await Promise.all([
    getBiosFiles(rom),
    getAdditionalFiles(rom),
    getEmulatorConfig(),
  ])
  const emulator = new Emulator({
    rom,
    biosFiles,
    additionalFiles,
    retroarchConfig: emulatorConfig.retroarch,
    coreConfig: emulatorConfig.retroarchCore,
  })
  globalContext.emulator = emulator
  await emulator.launch(waitForUserInteraction)
  emitter.emit('launched', rom)
}

function getConfigPath() {
  const configDirectory = PreferenceParser.get('configDirectory')
  return join(configDirectory, 'config.json')
}

async function getEmulatorConfig() {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  let config = { retroarch: undefined, retroarchCore: undefined }
  try {
    const blob = await globalContext.fileSystem.getContent(getConfigPath())
    const configContent = await blob.text()
    config = JSON.parse(configContent)
  } catch (error) {
    console.warn(error)
  }
  return config
}
