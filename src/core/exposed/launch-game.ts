import { Emulator } from '../classes/emulator'
import { type Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'
import { exitGame } from './exit-game'

export async function launchGame(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  try {
    exitGame()
  } catch {}

  const emulator = new Emulator({ rom })
  globalContext.emulator = emulator
  await emulator.launch()
}
