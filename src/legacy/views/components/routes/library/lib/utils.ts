export function isTouchDevice() {
  return 'ontouchstart' in globalThis || navigator.maxTouchPoints > 0
}
