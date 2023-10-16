import { useAtomValue } from 'jotai'
import { isGameLaunchedAtom } from '../../atoms'
import { VirtualControllerButtons } from './virtual-controller-buttons'

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0
}

export function VirtualController() {
  const isGameLaunched = useAtomValue(isGameLaunchedAtom)

  if (!isTouchDevice()) {
    return null
  }

  if (!isGameLaunched) {
    return null
  }

  return <VirtualControllerButtons />
}
