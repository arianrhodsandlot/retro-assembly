import { useSyncExternalStore } from 'react'

function subscribe(callback) {
  window.addEventListener('gamepadconnected', callback)
  window.addEventListener('gamepaddisconnected', callback)
  return () => {
    window.removeEventListener('gamepadconnected', callback)
    window.removeEventListener('gamepaddisconnected', callback)
  }
}

function getSnapshot() {
  const gamepads = navigator.getGamepads?.()
  const gamepad = gamepads?.[0]
  const connected = Boolean(gamepad)
  return { gamepads, gamepad, connected }
}

export function useGamepads() {
  return useSyncExternalStore(subscribe, getSnapshot)
}
