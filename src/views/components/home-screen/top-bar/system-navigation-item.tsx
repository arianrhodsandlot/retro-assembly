import { clsx } from 'clsx'
import delay from 'delay'
import { AnimatePresence, motion } from 'framer-motion'
import $ from 'jquery'
import { type FocusEvent, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { systemImageMap } from '../../../lib/constants'
import { useRouterHelpers } from '../hooks'
import { TopBarButton } from './top-bar-button'

export function SystemNavigationItem({ system }: { system: any }) {
  const { params, linkToSystem } = useRouterHelpers()
  const button = useRef<HTMLButtonElement>(null)

  const isSelected = system.name === params.system
  const shortName = system.fullName.split(' - ')[1]
  const displayName = !shortName || /^\d+$/.test(shortName) ? system.fullName : shortName

  async function onFocus(e: FocusEvent<HTMLButtonElement>) {
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
    <Link href={`${linkToSystem(system.name)}`} replace>
      <TopBarButton
        className='flex-shrink-0 px-8'
        highlighted={isSelected}
        key={system.name}
        onFocus={onFocus}
        ref={button}
        title={system.fullName}
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
    </Link>
  )
}
