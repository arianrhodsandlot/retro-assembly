import delay from 'delay'
import { AnimatePresence, motion } from 'framer-motion'
import $ from 'jquery'
import { type FocusEvent, useEffect, useRef } from 'react'
import { Link } from 'wouter'
import { platformImageMap } from '../../../../../../../lib/constants'
import { useRouterHelpers } from '../../../../../../hooks/use-router-helpers'
import { TopBarButton } from '../top-bar-button'
import { getPlatformDisplayName } from './utils'

interface PlatformNavigationItemProps {
  platform: {
    name: string
    fullName: string
  }
  highlighted?: boolean
}

export function PlatformNavigationItem({ platform, highlighted = false }: PlatformNavigationItemProps) {
  const { linkToPlatform } = useRouterHelpers()
  const button = useRef<HTMLButtonElement>(null)

  async function onFocus(e: FocusEvent<HTMLButtonElement>) {
    const $focusedElement = $(e.currentTarget)
    const $outer = $focusedElement.parent()
    if (highlighted) {
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
    if (highlighted) {
      button.current?.focus()
    }
  }, [highlighted])

  return (
    <Link href={`${linkToPlatform(platform.name)}`} replace>
      <TopBarButton
        className='flex-shrink-0 px-8'
        highlighted={highlighted}
        key={platform.name}
        onFocus={onFocus}
        ref={button}
        title={platform.fullName}
      >
        <div className='flex-center relative z-[1]'>
          <div className='flex-center'>
            <img
              alt={platform.fullName}
              className='drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]'
              height={36}
              src={platformImageMap[platform.name]}
              width={36}
            />
          </div>
          <AnimatePresence initial={false}>
            {highlighted ? (
              <motion.div
                animate={{ width: 'auto' }}
                className='box-content overflow-hidden whitespace-nowrap'
                exit={{ width: 0 }}
                initial={{ width: 0 }}
              >
                <div className='hidden pl-4 font-bold tracking-wider text-rose-700 md:block'>
                  {getPlatformDisplayName(platform.fullName)}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </TopBarButton>
    </Link>
  )
}
