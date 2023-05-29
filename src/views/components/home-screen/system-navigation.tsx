import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { type Ref } from 'react'
import { SystemNavigationItem } from './system-navigation-item'

export function SystemNavigation({
  currentSystem,
  systems,
  onChange,
  elementRef,
}: {
  currentSystem: string
  systems: any[]
  onChange: (systemName: string) => void
  elementRef: Ref<HTMLDivElement>
}) {
  return (
    <div
      className='system-navigation absolute w-full overflow-auto overflow-x-hidden bg-red-600 text-white'
      ref={elementRef}
    >
      <div className='flex items-center'>
        <div
          className='flex items-center px-6 text-center font-bold'
          style={{ fontFamily: "'Press Start 2P', cursive" }}
        >
          RETRO ASSEMBLY
        </div>

        <div className='flex h-16 flex-1 flex-nowrap overflow-x-auto overflow-y-hidden pt-1'>
          {systems.map((system) => (
            <SystemNavigationItem
              isSelected={system.name === currentSystem}
              key={system.name}
              onChange={onChange}
              system={system}
            />
          ))}
        </div>

        <div className='px-8'>
          <button
            className={clsx(
              'relative rounded-md p-2 transition-[color,background-color]',
              'focus:text-[#fe0000]',
              'focus:after:absolute focus:after:inset-0 focus:after:-z-10 focus:after:rounded-md focus:after:bg-white'
            )}
          >
            <Cog6ToothIcon className='h-8 w-8' />
          </button>
        </div>
      </div>
    </div>
  )
}
