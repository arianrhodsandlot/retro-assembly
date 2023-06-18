import { clsx } from 'clsx'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { systemImageMap } from '../../../lib/constants'
import { currentSystemNameAtom } from '../atoms'
import { TopBarButton } from './top-bar-button'

export function SystemNavigationItem({ system }: { system: any }) {
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)

  const isSelected = system.name === currentSystemName
  const shortName = system.fullName.split(' - ')[1]
  const displayName = /^\d+$/.test(shortName) ? system.fullName : shortName

  return (
    <TopBarButton
      className='px-8'
      highlighted={isSelected}
      key={system.name}
      onClick={() => setCurrentSystemName(system.name)}
    >
      <div className={clsx('relative z-[1] flex items-center justify-center')}>
        <div className={clsx('flex items-center justify-center')}>
          <img
            alt={system.fullName}
            className={clsx('drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]')}
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
              initial={{ width: 0 }}
            >
              <div className='pl-4 font-bold tracking-wider text-red-600'>{displayName}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </TopBarButton>
  )
}
