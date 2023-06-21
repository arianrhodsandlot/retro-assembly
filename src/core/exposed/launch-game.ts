import { Emulator } from '../classes/emulator'
import { type Rom } from '../classes/rom'
import { globalContext } from '../internal/global-context'

export async function launchGame(rom: Rom) {
  if (!globalContext.fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const emulator = new Emulator({ rom })
  globalContext.emulator = emulator
  await emulator.launch()
}
