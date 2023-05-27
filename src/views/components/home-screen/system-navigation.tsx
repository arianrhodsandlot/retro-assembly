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
      className='system-navigation absolute left-[200px] right-0 top-0 overflow-auto overflow-x-hidden bg-[#fe0000] text-white'
      ref={elementRef}
    >
      <div className='flex flex-nowrap'>
        {systems.map((system) => (
          <SystemNavigationItem
            isSelected={system.name === currentSystem}
            key={system.name}
            onChange={onChange}
            system={system}
          />
        ))}
      </div>
    </div>
  )
}
