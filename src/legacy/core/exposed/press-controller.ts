import { globalContext } from '../internal/global-context'

export function pressController(name: string, type: string) {
  const { emulator } = globalContext
  if (!emulator) {
    throw new Error('emulator is not valid')
  }

  if (type === 'down') {
    emulator.nostalgist?.pressDown(name)
  } else if (type === 'up') {
    emulator.nostalgist?.pressUp(name)
  }
}
