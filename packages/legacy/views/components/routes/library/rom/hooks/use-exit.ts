import { useAtom, useSetAtom } from 'jotai'
import { exitGame } from '../../../../../../core'
import { useRouterHelpers } from '../../../../hooks/use-router-helpers'
import { launchingFromHistoryAtom, launchingMaskAtom } from '../../atoms'
import { useCurrentPlatformName } from '../../platform/home-screen/hooks/use-current-platform'
import { showMenuOverlayAtom } from '../atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const [mask, setMask] = useAtom(launchingMaskAtom)
  const { navigateToPlatform } = useRouterHelpers()
  const currentPlatformName = useCurrentPlatformName()
  const setLaunchingFromHistory = useSetAtom(launchingFromHistoryAtom)

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setMask({ rom: mask?.rom })
    navigateToPlatform(currentPlatformName)
    setLaunchingFromHistory(false)
  }

  return { exit }
}
