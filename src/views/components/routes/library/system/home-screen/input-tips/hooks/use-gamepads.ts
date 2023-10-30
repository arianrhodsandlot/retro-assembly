import { useEffect, useState } from 'react'

export function useGamepads() {
  const [gamepads, setGamepads] = useState(navigator.getGamepads())
  const gamepad = gamepads[0]
  const connected = Boolean(gamepad)

  useEffect(() => {
    function updateGamepads() {
      setGamepads(navigator.getGamepads())
    }
    window.addEventListener('gamepadconnected', updateGamepads)
    window.addEventListener('gamepaddisconnected', updateGamepads)
    return () => {
      window.removeEventListener('gamepadconnected', updateGamepads)
      window.removeEventListener('gamepaddisconnected', updateGamepads)
    }
  }, [])

  return { gamepads, gamepad, connected }
}
