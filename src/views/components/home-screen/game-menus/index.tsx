import { AnimatePresence, motion } from 'framer-motion'
import { useAtom, useAtomValue } from 'jotai'
import { useCallback, useEffect } from 'react'
import { onPress, pauseGame, resumeGame } from '../../../../core'
import { isGameLaunchedAtom } from '../../atoms'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './atoms'
import { MenuEntryButton } from './menu-entry-button'
import { MenuOverlay } from './menu-overlay'

const menuShortcutButtons = ['l1', 'r1']

export function GameMenus() {
  const isGameLaunched = useAtomValue(isGameLaunchedAtom)
  const [showMenuOverlay, setShowMenuOverlay] = useAtom(showMenuOverlayAtom)
  const [previousFocusedElement, setPreviousFocusedElement] = useAtom(previousFocusedElementAtom)

  const toggleMenu = useCallback(() => {
    if (!isGameLaunched) {
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
  }, [isGameLaunched, showMenuOverlay, previousFocusedElement, setShowMenuOverlay, setPreviousFocusedElement])

  useEffect(() => {
    function onEscapeKeyup(event: KeyboardEvent) {
      if (isGameLaunched && event.key === 'Escape') {
        toggleMenu()
      }
    }

    const offPress = onPress(menuShortcutButtons, toggleMenu)
    document.addEventListener('keyup', onEscapeKeyup)

    return () => {
      offPress()
      document.removeEventListener('keyup', onEscapeKeyup)
    }
  }, [isGameLaunched, showMenuOverlay, toggleMenu])

  if (!isGameLaunched) {
    return
  }

  return (
    <>
      <MenuEntryButton onClick={toggleMenu} />

      <AnimatePresence>
        {showMenuOverlay ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='fixed inset-0 z-[11] overflow-hidden bg-black/90 text-white backdrop-blur'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <MenuOverlay />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
