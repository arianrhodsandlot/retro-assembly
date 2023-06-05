import { useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'
import { ui } from '../../../core'
import { currentSystemNameAtom } from './atoms'
import { ClearSiteDataButton } from './clear-site-data-button'
import { SystemNavigationItem } from './system-navigation-item'

const lastSelectedSystemStorageKey = 'last-selected-system'

export function SystemNavigation({ systems }: { systems?: any[] }) {
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const isValidSystems = systems?.length && systems.length > 0

  const selectPrevSystem = useCallback(() => {
    if (isValidSystems) {
      const index = systems.findIndex((system) => system.name === currentSystemName)
      if (index > 0) {
        setCurrentSystemName(systems[index - 1].name)
      } else {
        setCurrentSystemName(systems.at(-1)?.name || '')
      }
    }
  }, [isValidSystems, currentSystemName, setCurrentSystemName, systems])

  const selectNextSystem = useCallback(() => {
    if (isValidSystems) {
      const index = systems.findIndex((system) => system.name === currentSystemName)
      if (index < systems.length - 1) {
        setCurrentSystemName(systems[index + 1].name)
      } else {
        setCurrentSystemName(systems[0].name)
      }
    }
  }, [isValidSystems, currentSystemName, setCurrentSystemName, systems])

  useEffect(() => {
    if (currentSystemName) {
      localStorage.setItem(lastSelectedSystemStorageKey, currentSystemName)
    }
  }, [currentSystemName])

  useEffect(() => {
    ui.onPressButton('l1', selectPrevSystem)
    return () => {
      ui.offPressButton('l1', selectPrevSystem)
    }
  }, [selectPrevSystem])

  useEffect(() => {
    ui.onPressButton('r1', selectNextSystem)
    return () => {
      ui.offPressButton('r1', selectNextSystem)
    }
  }, [selectNextSystem])

  return (
    <div className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-auto overflow-x-hidden bg-red-600 to-red-700 text-white shadow-sm shadow-gray-700'>
      <div className='flex items-center px-10 text-center font-bold'>
        <span className='icon-[mdi--controller] mr-2 h-10 w-10' />
        Retro Assembly
      </div>

      <div className='flex flex-1 flex-nowrap overflow-x-auto overflow-y-hidden'>
        {systems?.map((system) => (
          <SystemNavigationItem key={system.name} system={system} />
        ))}
      </div>

      <div>
        <ClearSiteDataButton />
      </div>
    </div>
  )
}
