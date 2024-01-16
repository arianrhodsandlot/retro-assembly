import { isEqual } from 'lodash-es'
import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  window.addEventListener('gamepadconnected', callback)
  window.addEventListener('gamepaddisconnected', callback)
  return () => {
    window.removeEventListener('gamepadconnected', callback)
    window.removeEventListener('gamepaddisconnected', callback)
  }
}

let snapshot: (Gamepad | null)[]
function getSnapshot() {
  const gamepads = navigator.getGamepads?.()
  if (!isEqual(gamepads, snapshot)) {
    snapshot = gamepads
  }
  return snapshot
}

export function useGamepads() {
  const gamepads = useSyncExternalStore(subscribe, getSnapshot)
  const gamepad = gamepads?.[0]
  const connected = Boolean(gamepad)
  return { connected, gamepads, gamepad }
}
