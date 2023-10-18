import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { showMenuOverlayAtom } from '../../atoms'
import { VirtualControllerLandscape } from './virtual-controller-landscape'
import { VirtualControllerPortrait } from './virtual-controller-portrait'

function hasGamepads() {
  return navigator.getGamepads().some(Boolean)
}

let defaultShow = !hasGamepads()

window.addEventListener('gamepadconnected', () => {
  defaultShow = !hasGamepads()
})

window.addEventListener('gamepaddisconnected', () => {
  defaultShow = !hasGamepads()
})

export function VirtualControllerButtons() {
  const showMenuOverlay = useAtomValue(showMenuOverlayAtom)
  const [show, setShow] = useState(defaultShow)
  const buttonsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function showVirtualController(event: TouchEvent) {
      let isToggleElement = false
      if (event.target instanceof HTMLCanvasElement) {
        isToggleElement = true
      } else if (event.target instanceof HTMLDivElement) {
        isToggleElement = Boolean(buttonsContainerRef.current?.contains(event.target))
      }

      if (!isToggleElement) {
        return
      }

      setShow(true)
    }

    document.body.addEventListener('touchstart', showVirtualController)

    return () => {
      document.body.removeEventListener('touchstart', showVirtualController)
    }
  }, [])

  useEffect(() => {
    function onGamepadChange() {
      setShow(!hasGamepads())
    }
    window.addEventListener('gamepadconnected', onGamepadChange)
    window.addEventListener('gamepaddisconnected', onGamepadChange)
    return () => {
      window.removeEventListener('gamepadconnected', onGamepadChange)
      window.removeEventListener('gamepaddisconnected', onGamepadChange)
    }
  }, [])

  if (showMenuOverlay || !show) {
    return null
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className='touch-none'
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onContextMenu={(e) => e.preventDefault()}
      ref={buttonsContainerRef}
      transition={{ duration: 0.2 }}
    >
      <VirtualControllerPortrait />
      <VirtualControllerLandscape />
    </motion.div>
  )
}
