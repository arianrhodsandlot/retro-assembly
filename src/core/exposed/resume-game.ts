import { globalContext } from '../internal/global-context'

export function resumeGame() {
  const { emulator } = globalContext

  if (!emulator) {
    throw new Error('emulator is not valid')
  }

  emulator.resume()
  emulator.canvas.focus()
}
