import { VirtualControllerButtons } from './virtual-controller-buttons'

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function VirtualController() {
  if (!isTouchDevice()) {
    return null
  }

  return <VirtualControllerButtons />
}
