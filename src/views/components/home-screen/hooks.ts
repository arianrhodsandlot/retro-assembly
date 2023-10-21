import { useAtom, useSetAtom } from 'jotai'
import { exitGame } from '../../../core'
import { emitter } from '../../lib/emitter'
import { isGameRunningAtom, showMenuOverlayAtom } from '../atoms'
import { maskAtom } from './atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)
  const [mask, setMask] = useAtom(maskAtom)

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setIsGameRunningAtom(false)
    setMask({ rom: mask?.rom })
    emitter.emit('exit')
  }

  return { exit }
}
