import { useAtomValue } from 'jotai'
import { useEffect } from 'react'
import { game } from '../../../core'
import { currentRomAtom } from '../../lib/atoms'
import { MenuOverlay } from './menu-overlay'

export function Emulator() {
  const rom = useAtomValue(currentRomAtom)

  useEffect(() => {
    if (!rom) {
      return
    }
    game.launch(rom)
  }, [rom])

  return <MenuOverlay />
}
