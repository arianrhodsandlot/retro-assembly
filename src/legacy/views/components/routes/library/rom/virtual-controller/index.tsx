import { isTouchDevice } from '../../lib/utils'
import { VirtualControllerButtons } from './virtual-controller-buttons'

export function VirtualController() {
  if (!isTouchDevice()) {
    return null
  }

  return <VirtualControllerButtons />
}
