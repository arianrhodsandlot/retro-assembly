import { useAtom, useAtomValue } from 'jotai'
import $ from 'jquery'
import { useCallback, useEffect } from 'react'
import { onPress } from '../../../../core'
import { isGameIdleAtom } from '../../atoms'
import { currentSystemNameAtom, systemsAtom } from '../atoms'
import { SystemNavigationItem } from './system-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'
export function SystemNavigation() {
  const systems = useAtomValue(systemsAtom)
  const isGameIdle = useAtomValue(isGameIdleAtom)
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const isValidSystems = systems?.length && systems.length > 0

  const shouldSwitchSystem = useCallback(
    function shouldSwitchSystem() {
      const homeScreenLayout = document.querySelector('.home-screen-layout')
      const isFocusingHome =
        homeScreenLayout && document.activeElement && $.contains(homeScreenLayout, document.activeElement)
      return isFocusingHome && isGameIdle && isValidSystems
    },
    [isGameIdle, isValidSystems],
  )

  const selectPrevSystem = useCallback(() => {
    if (!shouldSwitchSystem()) {
      return
    }
    const index = systems.findIndex((system) => system.name === currentSystemName)
    if (index > 0) {
      setCurrentSystemName(systems[index - 1].name)
    } else {
      setCurrentSystemName(systems.at(-1)?.name || '')
    }
  }, [currentSystemName, setCurrentSystemName, systems, shouldSwitchSystem])

  const selectNextSystem = useCallback(() => {
    if (!shouldSwitchSystem()) {
      return
    }
    const index = systems.findIndex((system) => system.name === currentSystemName)
    if (index < systems.length - 1) {
      setCurrentSystemName(systems[index + 1].name)
    } else {
      setCurrentSystemName(systems[0].name)
    }
  }, [currentSystemName, setCurrentSystemName, systems, shouldSwitchSystem])

  useEffect(() => {
    if (currentSystemName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentSystemName)
    }
  }, [currentSystemName])

  useEffect(() => {
    const offPress = onPress('l1', selectPrevSystem)
    return () => {
      offPress()
    }
  }, [selectPrevSystem])

  useEffect(() => {
    const offPress = onPress('r1', selectNextSystem)
    return () => {
      offPress()
    }
  }, [selectNextSystem])

  return (
    <div className='system-navigation flex flex-1 flex-nowrap overflow-x-auto overflow-y-hidden'>
      {systems?.map((system) => <SystemNavigationItem key={system.name} system={system} />)}
    </div>
  )
}
