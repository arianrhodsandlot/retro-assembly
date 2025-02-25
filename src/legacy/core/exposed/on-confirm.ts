import { onPress } from './on-press'

export function onConfirm(callback: () => void) {
  return onPress('a', callback)
}
