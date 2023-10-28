import { useAtomValue } from 'jotai'
import { findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation, useParams } from 'wouter'
import type { SystemName } from '../../../../core'
import { onPress } from '../../../../core'
import { isUsingDemo } from '../../../../core/exposed/is-using-demo'
import { SpatialNavigation } from '../../../lib/spatial-navigation'
import { systemsAtom } from '../atoms'
import { historyDummySystem } from '../constants'
import { isFocusingHome } from '../utils'
import { SystemNavigationItem } from './system-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function SystemNavigation() {
  const [, setLocation] = useLocation()
  const params = useParams()
  const systems = useAtomValue(systemsAtom)
  const allSystems = useMemo(() => [historyDummySystem, ...systems], [systems])
  const showHistory = useMemo(() => !isUsingDemo(), [])

  const shouldSwitchSystem = isFocusingHome() && !SpatialNavigation.isPaused()
  const currentSystemIndex = findIndex(allSystems, { name: params.system as SystemName })

  const selectPrevSystem = useCallback(() => {
    if (!shouldSwitchSystem) {
      return
    }
    const newCurrentSystem = allSystems[currentSystemIndex - 1] ?? last(allSystems)
    setLocation(`/system/${newCurrentSystem.name}`, { replace: true })
  }, [currentSystemIndex, setLocation, allSystems, shouldSwitchSystem])

  const selectNextSystem = useCallback(() => {
    if (!shouldSwitchSystem) {
      return
    }
    const newCurrentSystem = allSystems[currentSystemIndex + 1] ?? first(allSystems)
    setLocation(`/system/${newCurrentSystem.name}`, { replace: true })
  }, [currentSystemIndex, setLocation, allSystems, shouldSwitchSystem])

  useEffect(() => {
    if (params.system) {
      localStorage.setItem(lastSelectedSystemStorageKey, params.system)
    }
  }, [params.system])

  useEffect(() => onPress('l1', selectPrevSystem), [selectPrevSystem])
  useEffect(() => onPress('r1', selectNextSystem), [selectNextSystem])

  return (
    <div className='system-navigation flex flex-1 flex-nowrap overflow-x-auto overflow-y-hidden'>
      {showHistory ? <SystemNavigationItem system={historyDummySystem} /> : null}
      {systems.map((system) => (
        <SystemNavigationItem key={system.name} system={system} />
      ))}
    </div>
  )
}
