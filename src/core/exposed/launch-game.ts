import { Emulator } from '../classes/emulator'
import { type Rom } from '../classes/rom'
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

  try {
    exitGame()
  } catch {}

  const emulator = new Emulator({ rom })
  globalContext.emulator = emulator
  await emulator.launch(waitForUserInteraction)
  emitter.emit('launched', rom)
}
