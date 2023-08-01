import { useAtom, useAtomValue } from 'jotai'
import $ from 'jquery'
import { findIndex, first, last } from 'lodash-es'
import { useCallback, useEffect, useMemo } from 'react'
import { SystemName, onPress } from '../../../../core'
import { isGameIdleAtom } from '../../atoms'
import { currentSystemNameAtom, systemsAtom } from '../atoms'
import { historyDummySystem } from '../constants'
import { SystemNavigationItem } from './system-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'

function isFocusingHome() {
  if (!document.activeElement) {
    return false
  }

  const homeScreenLayout = document.querySelector('.home-screen-layout')
  if (!homeScreenLayout) {
    return false
  }

  return $.contains(homeScreenLayout, document.activeElement)
}

export function SystemNavigation() {
  const systems = useAtomValue(systemsAtom)
  const isGameIdle = useAtomValue(isGameIdleAtom)
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const allSystems = useMemo(() => [historyDummySystem, ...systems], [systems])

  const shouldSwitchSystem = isFocusingHome() && isGameIdle
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
      <SystemNavigationItem system={historyDummySystem} />
      {systems.map((system) => (
        <SystemNavigationItem key={system.name} system={system} />
      ))}
    </div>
  )
}
