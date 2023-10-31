import { useAtomValue } from 'jotai'
import { findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { type PlatformName } from '../../../../../../../core'
import { onPress } from '../../../../../../../core'
import { isUsingDemo } from '../../../../../../../core/exposed/is-using-demo'
import { SpatialNavigation } from '../../../../../../lib/spatial-navigation'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { platformsAtom } from '../atoms'
import { historyDummyPlatform } from '../constants'
import { isFocusingHome } from '../utils'
import { PlatformNavigationItem } from './platform-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function PlatformNavigation() {
  const { params, navigateToPlatform: navigateToSystem } = useRouterHelpers()
  const platforms = useAtomValue(platformsAtom)
  const allPlatforms = useMemo(() => [historyDummyPlatform, ...platforms], [platforms])
  const showHistory = useMemo(() => !isUsingDemo(), [])

  const shouldSwitchPlatform = isFocusingHome() && !SpatialNavigation.isPaused()
  const currentSystemIndex = findIndex(allPlatforms, { name: params.platform as PlatformName })

  const selectPrevSystem = useCallback(() => {
    if (!shouldSwitchPlatform) {
      return
    }
    const newCurrentSystem = allPlatforms[currentSystemIndex - 1] ?? last(allPlatforms)
    navigateToSystem(newCurrentSystem.name)
  }, [currentSystemIndex, navigateToSystem, allPlatforms, shouldSwitchPlatform])

  const selectNextSystem = useCallback(() => {
    if (!shouldSwitchPlatform) {
      return
    }
    const newCurrentSystem = allPlatforms[currentSystemIndex + 1] ?? first(allPlatforms)
    navigateToSystem(newCurrentSystem.name)
  }, [currentSystemIndex, navigateToSystem, allPlatforms, shouldSwitchPlatform])

  useEffect(() => {
    if (!isUsingDemo() && params.platform) {
      localStorage.setItem(lastSelectedSystemStorageKey, params.platform)
    }
  }, [params.platform])

  useEffect(() => onPress('l1', selectPrevSystem), [selectPrevSystem])
  useEffect(() => onPress('r1', selectNextSystem), [selectNextSystem])

  return (
    <div className='platform-navigation flex flex-1 flex-nowrap overflow-x-auto overflow-y-hidden'>
      {showHistory ? <PlatformNavigationItem platform={historyDummyPlatform} /> : null}
      {platforms.map((platform) => (
        <PlatformNavigationItem key={platform.name} platform={platform} />
      ))}
    </div>
  )
}
