import { clsx } from 'clsx'
import delay from 'delay'
import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import $ from 'jquery'
import { useEffect, useRef } from 'react'
import { systemImageMap } from '../../../lib/constants'
import { currentSystemNameAtom } from '../atoms'
import { TopBarButton } from './top-bar-button'

export function SystemNavigationItem({ system }: { system: any }) {
  const [currentSystemName, setCurrentSystemName] = useAtom(currentSystemNameAtom)
  const button = useRef<HTMLButtonElement>(null)

  const isSelected = system.name === currentSystemName
  const shortName = system.fullName.split(' - ')[1]
  const displayName = /^\d+$/.test(shortName) ? system.fullName : shortName

  async function onFocus(e: React.FocusEvent<HTMLButtonElement, Element>) {
    const $focusedElement = $(e.currentTarget)
    const $outer = $focusedElement.parent()
    if (isSelected) {
      await delay(300)
    }
    const outerScrollLeft = $outer.scrollLeft()
    const outerWidth = $outer.width()
    const focusedElementWidth = $focusedElement.width()
    if (outerScrollLeft !== undefined && outerWidth !== undefined && focusedElementWidth !== undefined) {
      const offsetLeft = $focusedElement.position().left + outerScrollLeft
      const scrollLeft = offsetLeft - outerWidth + focusedElementWidth
      $outer.stop().animate({ scrollLeft }, 300)
    }
  }

  useEffect(() => {
    if (isSelected) {
      button.current?.focus()
    }
  }, [isSelected])

  return (
    <TopBarButton
      className='flex-shrink-0 px-8'
      highlighted={isSelected}
      key={system.name}
      onClick={() => setCurrentSystemName(system.name)}
      onFocus={onFocus}
      ref={button}
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
              <div className='hidden pl-4 font-bold tracking-wider text-rose-700 md:block'>{displayName}</div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </TopBarButton>
  )
}
