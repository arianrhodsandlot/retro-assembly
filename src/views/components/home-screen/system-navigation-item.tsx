import { clsx } from 'clsx'
import { systemImageMap } from '../../lib/constants'

export function SystemNavigationItem({
  system,
  isSelected,
  onChange,
}: {
  system: any
  isSelected: boolean
  onChange: any
}) {
  return (
    <button
      aria-hidden
      className={clsx(
        'relative flex shrink-0 items-center justify-center border-[#fe0000] px-8 py-4 transition-[opacity,background-color] hover:opacity-100',
        'focus:after:absolute focus:after:inset-0 focus:after:animate-pulse focus:after:border-2 focus:after:border-white',
        {
          'opacity-80': !isSelected,
          'bg-[#ac000d]': isSelected,
        }
      )}
      key={system.name}
      onClick={() => onChange(system.name)}
    >
      <img alt='' height={50} src={systemImageMap[system.name]} width={50} />
      {isSelected ? <div className='ml-2'>{system.fullName}</div> : null}
    </button>
  )
}
