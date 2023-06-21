import { offPressButton, offPressButtons, onPressButton, onPressButtons } from '../helpers/gamepad'

export function onPress(button: string | string[], callback: () => void) {
  if (typeof button === 'string') {
    onPressButton(button, callback)
    return function offPressCurrentButtons() {
      offPressButton(button, callback)
    }
  }

  if (Array.isArray(button)) {
    onPressButtons(button, callback)
    return function offPressCurrentButtons() {
      offPressButtons(button, callback)
    }
  }

  throw new Error('invalid button to listen for')
}
