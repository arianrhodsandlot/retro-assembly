import { globalContext } from '../internal/global-context'

export function pauseGame() {
  const { emulator } = globalContext

  if (!emulator) {
    throw new Error('emulator is not valid')
  }

  emulator.pause()
}
