import { type PressButtonListenerFunction, offPressAnyButton, onPressAnyButton } from '../helpers/gamepad'

export function onPressAny(callback: PressButtonListenerFunction) {
  onPressAnyButton(callback)
  return () => offPressAnyButton(callback)
}
