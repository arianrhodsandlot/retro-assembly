import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { pauseGame, resumeGame } from '../../../../core'
import { showMenuOverlayAtom } from '../atoms'
import { VirtualButton } from './virtual-button'

export function VirtualControllerMenuButton() {
  const [showMenuOverlay, setShowMenuOverlay] = useAtom(showMenuOverlayAtom)

  const toggleMenu = useCallback(() => {
    if (showMenuOverlay) {
      resumeGame()
    } else {
      pauseGame()
    }

    setShowMenuOverlay(!showMenuOverlay)
  }, [showMenuOverlay, setShowMenuOverlay])

  return (
    <VirtualButton onTap={toggleMenu}>
      <span className='icon-[mdi--menu] h-6 w-6' />
    </VirtualButton>
  )
}
