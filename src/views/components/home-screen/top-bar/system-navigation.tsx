import { useAtom, useAtomValue } from 'jotai'
import { findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import type { SystemName } from '../../../../core'
import { onPress } from '../../../../core'
import { isUsingDemo } from '../../../../core/exposed/is-using-demo'
import { SpatialNavigation } from '../../../lib/spatial-navigation'
import { isGameIdleAtom } from '../../atoms'
import { currentSystemNameAtom, systemsAtom } from '../atoms'
import { historyDummySystem } from '../constants'
import { isFocusingHome } from '../utils'
import { SystemNavigationItem } from './system-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function SystemNavigation() {
  const systems = useAtomValue(systemsAtom)
  const isGameIdle = useAtomValue(isGameIdleAtom)
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const allSystems = useMemo(() => [historyDummySystem, ...systems], [systems])
  const showHistory = useMemo(() => !isUsingDemo(), [])

  const shouldSwitchSystem = isFocusingHome() && !SpatialNavigation.isPaused() && isGameIdle
  const currentSystemIndex = findIndex(allSystems, { name: currentSystemName as SystemName })

  const selectPrevSystem = useCallback(() => {
    if (!shouldSwitchSystem) {
      return
    }
    const newCurrentSystem = allSystems[currentSystemIndex - 1] ?? last(allSystems)
    setCurrentSystemName(newCurrentSystem.name)
  }, [currentSystemIndex, setCurrentSystemName, allSystems, shouldSwitchSystem])

  const selectNextSystem = useCallback(() => {
    if (!shouldSwitchSystem) {
      return
    }
    const newCurrentSystem = allSystems[currentSystemIndex + 1] ?? first(allSystems)
    setCurrentSystemName(newCurrentSystem.name)
  }, [currentSystemIndex, setCurrentSystemName, allSystems, shouldSwitchSystem])

  useEffect(() => {
    if (currentSystemName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentSystemName)
    }
  }, [currentSystemName])

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
