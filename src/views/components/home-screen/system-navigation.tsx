import classNames from 'classnames'
import { type Ref } from 'react'

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
    <div className='w-full overflow-auto' ref={elementRef}>
      <div className='flex flex-nowrap'>
        {systems.map((system) => (
          <div
            role='button'
            className={classNames('flex shrink-0 items-center justify-center border border-[#fe0000] px-3 py-2', {
              'bg-[#fe0000] text-white': system.name === currentSystem,
            })}
            key={system.name}
            aria-hidden
            onClick={() => onChange(system.name)}
          >
            {system.fullName}
          </div>
        ))}
      </div>
    </div>
  )
}
