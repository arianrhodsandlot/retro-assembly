import { isEqual } from 'lodash-es'
import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  globalThis.addEventListener('gamepadconnected', callback)
  globalThis.addEventListener('gamepaddisconnected', callback)
  return () => {
    globalThis.removeEventListener('gamepadconnected', callback)
    globalThis.removeEventListener('gamepaddisconnected', callback)
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
  return { connected, gamepad, gamepads }
}
