import { onPress } from './on-press'

export function onCancel(callback: () => void) {
  return onPress('b', callback)
}
