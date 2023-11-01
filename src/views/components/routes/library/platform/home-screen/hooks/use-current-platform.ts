import { useAtomValue } from 'jotai'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { launchingFromHistoryAtom } from '../../../atoms'

export function useCurrentPlatformName() {
  const { params } = useRouterHelpers()
  const launchingFromHistory = useAtomValue(launchingFromHistoryAtom)
  return launchingFromHistory ? 'history' : params.platform
}
