import { globalContext } from '../internal/global-context'

export function exitGame() {
  const { emulator } = globalContext
  globalContext.emulator = undefined

  if (!emulator) {
    throw new Error('there are no emulators running, no need to exit')
  }
  emulator.exit()
}
