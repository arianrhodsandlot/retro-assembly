import { AnimatePresence, type TargetAndTransition, motion } from 'framer-motion'
import { useRef } from 'react'
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
  const buttonRef = useRef<HTMLButtonElement>(null)

  function onFocus() {
    const target = buttonRef.current
    const container = target?.parentElement
    if (!target || !container) {
      return
    }
    const left = target.offsetLeft - container.offsetLeft - target.clientWidth
    container.scroll({ left: left >= 0 ? left : 0, behavior: 'smooth' })
  }

  function onAnimationComplete(definition: TargetAndTransition) {
    if (highlighted && definition.width === 'auto') {
      onFocus()
    }
  }

  return (
    // @ts-expect-error Link can accept ref
    <Link href={`${linkToPlatform(platform.name)}`} ref={buttonRef} replace>
      <TopBarButton
        className='flex-shrink-0 px-8'
        highlighted={highlighted}
        key={platform.name}
        onFocus={onFocus}
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
                onAnimationComplete={onAnimationComplete}
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
