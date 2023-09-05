import { Emulator } from '../classes/emulator'
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

  const [biosFiles, additionalFiles] = await Promise.all([getBiosFiles(rom), getAdditionalFiles(rom)])

  const emulator = new Emulator({ rom, biosFiles, additionalFiles })
  globalContext.emulator = emulator
  await emulator.launch(waitForUserInteraction)
  emitter.emit('launched', rom)
}
