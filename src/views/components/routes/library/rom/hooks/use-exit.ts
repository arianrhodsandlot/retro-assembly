import { useAtom, useSetAtom } from 'jotai'
import { exitGame } from '../../../../../../core'
import { useRouterHelpers } from '../../../../hooks/use-router-helpers'
import { launchingMaskAtom } from '../../atoms'
import { showMenuOverlayAtom } from '../atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const [mask, setMask] = useAtom(launchingMaskAtom)
  const { navigateToSystem } = useRouterHelpers()

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setMask({ rom: mask?.rom })
    navigateToSystem()
  }

  return { exit }
}
