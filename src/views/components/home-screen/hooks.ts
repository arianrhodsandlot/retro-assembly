import { useAtomValue, useSetAtom } from 'jotai'
import { exitGame } from '../../../core'
import { emitter } from '../../lib/emitter'
import { isGameRunningAtom, showMenuOverlayAtom } from '../atoms'
import { maskAtom } from './atoms'
import { previousFocusedElementAtom } from './game-menus/atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const previousFocusedElement = useAtomValue(previousFocusedElementAtom)
  const setIsGameRunningAtom = useSetAtom(isGameRunningAtom)
  const setMask = useSetAtom(maskAtom)

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setIsGameRunningAtom(false)
    setMask(undefined)
    previousFocusedElement?.focus()
    emitter.emit('exit')
  }

  return { exit }
}
