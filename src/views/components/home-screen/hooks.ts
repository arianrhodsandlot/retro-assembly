import { useAtom, useSetAtom } from 'jotai'
import { useLocation, useParams } from 'wouter'
import { exitGame } from '../../../core'
import { showMenuOverlayAtom } from '../atoms'
import { launchingMaskAtom } from './atoms'

export function useExit() {
  const setShowMenuOverlay = useSetAtom(showMenuOverlayAtom)
  const [mask, setMask] = useAtom(launchingMaskAtom)
  const [, setLocation] = useLocation()
  const params = useParams()

  function exit() {
    exitGame()
    setShowMenuOverlay(false)
    setMask({ rom: mask?.rom })
    setLocation(`/system/${params.system}`, { replace: true })
  }

  return { exit }
}
