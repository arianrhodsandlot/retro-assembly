import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { systemImageMap } from '../../lib/constants'
import { currentSystemNameAtom } from './atoms'

export function SystemNavigationItem({ system }: { system: any }) {
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)

  const isSelected = system.name === currentSystemName
  const shortName = system.fullName.split(' - ')[1]

  function onClick() {
    setCurrentSystemName(system.name)
  }

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
      onClick={onClick}
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
        <AnimatePresence initial={false}>
          {isSelected ? (
            <motion.div
              animate={{ width: 'auto' }}
              className='box-content overflow-hidden whitespace-nowrap'
              exit={{ width: 0 }}
            >
              <div className='pl-4 font-bold tracking-wider text-red-600'>{shortName}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </button>
  )
}
