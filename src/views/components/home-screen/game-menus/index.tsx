import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { detectHasRunningGame, onPress, pauseGame, resumeGame } from '../../../../core'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './atoms'
import { MenuEntryButton } from './menu-entry-button'
import { MenuOverlay } from './menu-overlay'

const menuShortcutButtons = ['l1', 'r1']

export function GameMenus() {
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
    function onEscapeKeyup(event: KeyboardEvent) {
      if (detectHasRunningGame() && event.key === 'Escape') {
        toggleMenu()
      }
    }

    const offPress = onPress(menuShortcutButtons, toggleMenu)
    document.addEventListener('keyup', onEscapeKeyup)

    return () => {
      offPress()
      document.removeEventListener('keyup', onEscapeKeyup)
    }
  }, [showMenuOverlay, toggleMenu])

  return createPortal(
    <>
      <MenuEntryButton onClick={toggleMenu} />

      <AnimatePresence>
        {showMenuOverlay ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='absolute inset-0 z-[11] overflow-hidden bg-black/90 text-white backdrop-blur'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MenuOverlay />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>,
    document.body
  )
}
