import { globalContext } from '../internal/global-context'

export function detectHasRunningGame() {
  const { emulator } = globalContext
  return emulator?.processStatus === 'ready'
}
