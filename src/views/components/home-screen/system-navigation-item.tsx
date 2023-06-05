import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
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
  const shortName = system.fullName.split(' - ')[1]
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    setDuration(0.2)
  }, [])

  return (
    <button
      aria-hidden
      className={clsx(
        'relative border-r border-red-800 px-8 text-sm transition-[opacity,background-color] first:border-l',
        'after:absolute after:inset-0 after:z-0 after:shadow-inner after:transition-[background-color]',
        { 'after:bg-white': isSelected },
        isSelected ? 'focus:after:bg-white' : 'focus:after:bg-red-800',
        isSelected ? 'hover:after:bg-white' : 'hover:after:bg-red-800'
      )}
      key={system.name}
      onClick={() => onChange(system.name)}
    >
      <div className={clsx('relative z-[1] flex items-center justify-center')}>
        <div className={clsx('flex items-center justify-center')}>
          <img
            alt={shortName}
            className={clsx('drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)] transition-all', {
              'scale-110': isSelected,
            })}
            height={36}
            src={systemImageMap[system.name]}
            width={36}
          />
        </div>
        <AnimatePresence>
          {isSelected ? (
            <motion.div
              animate={{ width: 'auto' }}
              className='box-content overflow-hidden whitespace-nowrap'
              exit={{ width: 0 }}
              initial={{ width: 0 }}
              transition={{ duration }}
            >
              <div className='pl-4 text-red-600'>{shortName}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </button>
  )
}
