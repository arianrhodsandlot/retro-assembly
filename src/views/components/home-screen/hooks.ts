import { useAtomValue, useSetAtom } from 'jotai'
import { exitGame } from '../../../core'
import { emitter } from '../../lib/emitter'
import { isGameRunningAtom } from '../atoms'
import { previousFocusedElementAtom, showMenuOverlayAtom } from './game-menus/atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const previousFocusedElement = useAtomValue(previousFocusedElementAtom)
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setIsGameRunningAtom(false)
    previousFocusedElement?.focus()
    emitter.emit('exit')
  }

  return { exit }
}
