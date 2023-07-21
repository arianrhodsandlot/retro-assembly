import { offPressAnyButton, onPressAnyButton } from '../helpers/gamepad'

export function onPressAny(callback: (params) => void) {
  onPressAnyButton(callback)
  return () => offPressAnyButton(callback)
}
