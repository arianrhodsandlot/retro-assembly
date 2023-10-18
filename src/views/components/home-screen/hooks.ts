import { useSetAtom } from 'jotai'
import { exitGame } from '../../../core'
import { emitter } from '../../lib/emitter'
import { isGameRunningAtom, showMenuOverlayAtom } from '../atoms'
import { maskAtom } from './atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)
  const setMask = useSetAtom(maskAtom)

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setIsGameRunningAtom(false)
    setMask(undefined)
    emitter.emit('exit')
  }

  return { exit }
}
