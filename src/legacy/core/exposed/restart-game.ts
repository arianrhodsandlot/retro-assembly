import { globalContext } from '../internal/global-context'

export function restartGame() {
  const { emulator } = globalContext

  if (!emulator) {
    throw new Error('emulator is not valid')
  }

  emulator.restart()
}
