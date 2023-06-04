import { ClearSiteDataButton } from './clear-site-data-button'
import { SystemNavigationItem } from './system-navigation-item'

export function SystemNavigation({
  currentSystem,
  systems,
  onChange,
}: {
  currentSystem: string
  systems: any[]
  onChange: (systemName: string) => void
}) {
  return (
    <div className='system-navigation z-[1] flex w-full items-center overflow-auto overflow-x-hidden bg-red-600 text-white shadow-sm shadow-gray-700'>
      <div className='flex items-center px-6 text-center font-bold' style={{ fontFamily: "'Press Start 2P', cursive" }}>
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
        <ClearSiteDataButton />
      </div>
    </div>
  )
}
