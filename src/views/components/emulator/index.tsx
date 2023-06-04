import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { game, ui } from '../../../core'
import { showMenuOverlayAtom } from './atoms'
import { MenuOverlay } from './menu-overlay'

const menuHotButtons = ['l3', 'r3']

export function Emulator() {
  const [showMenuOverlay, setShowMenuOverlay] = useAtom(showMenuOverlayAtom)
  const previousActiveElementRef = useRef<Element | null>(null)

  const toggleMenu = useCallback(() => {
    if (!game.isRunning()) {
      return
    }

    if (showMenuOverlay) {
      game.start()
      setShowMenuOverlay(false)
    } else {
      game.pause()
    }
    setShowMenuOverlay(!showMenuOverlay)
  }, [showMenuOverlay, setShowMenuOverlay])

  useEffect(() => {
    function onControlKeyup(event: KeyboardEvent) {
      if (game.isRunning() && event.key === 'Control') {
        toggleMenu()
      }
    }

    ui.onPressButtons(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', onControlKeyup)

    if (!showMenuOverlay) {
      // @ts-expect-error focus previous active element
      previousActiveElementRef.current?.focus()
    }

    return () => {
      ui.offPressButtons(menuHotButtons, toggleMenu)
      document.removeEventListener('keyup', onControlKeyup)
    }
  }, [showMenuOverlay, toggleMenu])

  return createPortal(
    <AnimatePresence>
      {showMenuOverlay ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='absolute inset-0 z-[11] overflow-hidden bg-[#00000088] text-white backdrop-blur'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <MenuOverlay />
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  )
}
