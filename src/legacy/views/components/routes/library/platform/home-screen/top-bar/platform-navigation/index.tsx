import { useAtomValue } from 'jotai'
import { find, findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { isUsingDemo, onPress, type PlatformName } from '../../../../../../../../core'
import { SpatialNavigation } from '../../../../../../../lib/spatial-navigation'
import { useRouterHelpers } from '../../../../../../hooks/use-router-helpers'
import { platformsAtom } from '../../atoms'
import { historyDummyPlatform } from '../../constants'
import { useCurrentPlatformName } from '../../hooks/use-current-platform'
import { useFocusingHome } from '../../hooks/use-focusing-home'
import { PlatformNavigationDesktop } from './platform-navigation-desktop'
import { PlatformNavigationMobile } from './platform-navigation-mobile'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function PlatformNavigation() {
  const usingDemo = isUsingDemo()
  const { isPlatformRoute, navigateToPlatform } = useRouterHelpers()
  const focusingHome = useFocusingHome()
  const platforms = useAtomValue(platformsAtom)
  const allPlatforms = useMemo(
    () => (usingDemo ? platforms : [historyDummyPlatform, ...platforms]),
    [usingDemo, platforms],
  )

  const currentPlatformName = useCurrentPlatformName()

  const shouldSwitchPlatform = isPlatformRoute && focusingHome && !SpatialNavigation.isPaused()
  const currentPlatform = find(allPlatforms, { name: currentPlatformName as PlatformName })
  const currentPlatformIndex = findIndex(allPlatforms, { name: currentPlatformName as PlatformName })

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
    if (!isUsingDemo() && currentPlatformName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentPlatformName)
    }
  }, [currentPlatformName])

  useEffect(() => onPress('l1', selectPrevSystem), [selectPrevSystem])
  useEffect(() => onPress('r1', selectNextSystem), [selectNextSystem])

  return (
    <>
      <PlatformNavigationDesktop current={currentPlatform} platforms={allPlatforms} />
      <PlatformNavigationMobile current={currentPlatform} platforms={allPlatforms} />
    </>
  )
}
