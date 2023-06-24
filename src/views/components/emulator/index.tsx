import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { detectHasRunningGame, onPress, pauseGame, resumeGame } from '../../../core'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './atoms'
import { MenuOverlay } from './menu-overlay'

const menuHotButtons = ['l3', 'r3']

export function Emulator() {
  const [showMenuOverlay, setShowMenuOverlay] = useAtom(showMenuOverlayAtom)
  const [previousFocusedElement, setPreviousFocusedElement] = useAtom(previousFocusedElementAtom)

  const toggleMenu = useCallback(() => {
    if (!detectHasRunningGame()) {
      return
    }

    if (showMenuOverlay) {
      previousFocusedElement?.focus()
      resumeGame()
    } else {
      setPreviousFocusedElement(document.activeElement as HTMLElement)
      pauseGame()
    }

    setShowMenuOverlay(!showMenuOverlay)
  }, [showMenuOverlay, previousFocusedElement, setShowMenuOverlay, setPreviousFocusedElement])

  useEffect(() => {
    function onControlKeyup(event: KeyboardEvent) {
      if (detectHasRunningGame() && event.key === 'Control') {
        toggleMenu()
      }
    }

    const offPress = onPress(menuHotButtons, toggleMenu)
    document.addEventListener('keyup', onControlKeyup)

    return () => {
      offPress()
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
