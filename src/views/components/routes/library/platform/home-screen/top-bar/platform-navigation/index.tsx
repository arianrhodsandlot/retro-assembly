import { useAtomValue } from 'jotai'
import { find, findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { type PlatformName } from '../../../../../../../../core'
import { onPress } from '../../../../../../../../core'
import { isUsingDemo } from '../../../../../../../../core/exposed/is-using-demo'
import { SpatialNavigation } from '../../../../../../../lib/spatial-navigation'
import { useRouterHelpers } from '../../../../../../hooks/use-router-helpers'
import { platformsAtom } from '../../atoms'
import { historyDummyPlatform } from '../../constants'
import { useFocusingHome } from '../../hooks/use-focusing-home'
import { PlatformNavigationDesktop } from './platform-navigation-desktop'
import { PlatformNavigationMobile } from './platform-navigation-mobile'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function PlatformNavigation() {
  const usingDemo = isUsingDemo()
  const { params, isPlatformRoute, navigateToPlatform } = useRouterHelpers()
  const focusingHome = useFocusingHome()
  const platforms = useAtomValue(platformsAtom)
  const allPlatforms = useMemo(
    () => (usingDemo ? platforms : [historyDummyPlatform, ...platforms]),
    [usingDemo, platforms],
  )

  const shouldSwitchPlatform = isPlatformRoute && focusingHome && !SpatialNavigation.isPaused()
  const currentPlatform = find(allPlatforms, { name: params.platform as PlatformName })
  const currentPlatformIndex = findIndex(allPlatforms, { name: params.platform as PlatformName })

  const selectPrevSystem = useCallback(() => {
    if (!shouldSwitchPlatform) {
      return
    }
    const newCurrentSystem = allPlatforms[currentPlatformIndex - 1] ?? last(allPlatforms)
    navigateToPlatform(newCurrentSystem.name)
  }, [currentPlatformIndex, navigateToPlatform, allPlatforms, shouldSwitchPlatform])

  const selectNextSystem = useCallback(() => {
    if (!shouldSwitchPlatform) {
      return
    }
    const newCurrentSystem = allPlatforms[currentPlatformIndex + 1] ?? first(allPlatforms)
    navigateToPlatform(newCurrentSystem.name)
  }, [currentPlatformIndex, navigateToPlatform, allPlatforms, shouldSwitchPlatform])

  useEffect(() => {
    if (!isUsingDemo() && params.platform) {
      localStorage.setItem(lastSelectedSystemStorageKey, params.platform)
    }
  }, [params.platform])

  useEffect(() => onPress('l1', selectPrevSystem), [selectPrevSystem])
  useEffect(() => onPress('r1', selectNextSystem), [selectNextSystem])

  return (
    <>
      <PlatformNavigationDesktop current={currentPlatform} platforms={allPlatforms} />
      <PlatformNavigationMobile current={currentPlatform} platforms={allPlatforms} />
    </>
  )
}
