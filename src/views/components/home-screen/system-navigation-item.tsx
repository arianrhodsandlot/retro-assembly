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
        'relative h-full shrink-0 border-red-600 px-8 text-red-600 transition-[opacity,background-color]',
        'hover:opacity-100',
        'after:absolute after:inset-0 after:z-0 after:rounded-t after:shadow-inner',
        'focus:after:animate-pulse',
        isSelected ? 'rounded-t font-bold text-red-600 after:bg-white' : 'text-white opacity-90',
        isSelected ? 'focus:after:bg-white' : 'focus:after:bg-red-800',
        isSelected ? 'hover:after:bg-white' : 'hover:after:bg-red-700'
      )}
      key={system.name}
      onClick={() => onChange(system.name)}
      style={{ fontFamily: 'system-ui, serif' }}
    >
      <div className='relative z-[1] flex items-center justify-center'>
        <img alt={system.fullName} height={40} src={systemImageMap[system.name]} width={40} />
        {isSelected ? <div className='ml-2'>{system.fullName}</div> : null}
      </div>
    </button>
  )
}
