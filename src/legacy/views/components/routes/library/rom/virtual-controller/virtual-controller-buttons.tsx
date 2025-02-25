import { motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { useEffect, useRef, useState } from 'react'
import { showMenuOverlayAtom } from '../atoms'
import { VirtualControllerLandscape } from './virtual-controller-landscape'
import { VirtualControllerPortrait } from './virtual-controller-portrait'

function hasGamepads() {
  return navigator.getGamepads().some(Boolean)
}

let defaultShow = !hasGamepads()

globalThis.addEventListener('gamepadconnected', () => {
  defaultShow = !hasGamepads()
})

globalThis.addEventListener('gamepaddisconnected', () => {
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
    globalThis.addEventListener('gamepadconnected', onGamepadChange)
    globalThis.addEventListener('gamepaddisconnected', onGamepadChange)
    return () => {
      globalThis.removeEventListener('gamepadconnected', onGamepadChange)
      globalThis.removeEventListener('gamepaddisconnected', onGamepadChange)
    }
  }, [])

  if (showMenuOverlay || !show) {
    return null
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className='fixed inset-0 z-[11] select-none'
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onContextMenu={(e) => e.preventDefault()}
      onTouchEnd={(e) => e.preventDefault()}
      ref={buttonsContainerRef}
      transition={{ duration: 0.2 }}
    >
      <VirtualControllerPortrait />
      <VirtualControllerLandscape />
    </motion.div>
  )
}
