import { offPressAnyButton, onPressAnyButton, type PressButtonListenerFunction } from '../helpers/gamepad'

export function onPressAny(callback: PressButtonListenerFunction) {
  onPressAnyButton(callback)
  return () => offPressAnyButton(callback)
}
