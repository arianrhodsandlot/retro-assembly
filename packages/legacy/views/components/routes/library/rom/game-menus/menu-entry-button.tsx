import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { SpatialNavigation } from '../../../../../lib/spatial-navigation'
import { isTouchDevice } from '../../lib/utils'
import { showMenuOverlayAtom } from '../atoms'
import { useMouseMoving } from './hooks/use-mouse-moving'

function focusCanvas() {
  SpatialNavigation.focus('canvas')
}

export function MenuEntryButton({ onClick }: { onClick: () => void }) {
  const showMenuOverlay = useAtomValue(showMenuOverlayAtom)
  const { isMouseMoving } = useMouseMoving({ timeout: 3000 })

  const showMenuEntryButton = isMouseMoving && !showMenuOverlay

  if (isTouchDevice()) {
    return null
  }

  return (
    <AnimatePresence>
      {showMenuEntryButton ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='fixed inset-0 z-20 flex items-end justify-center bg-gradient-to-b from-transparent from-80% to-black/80'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={focusCanvas}
          transition={{ duration: 0.1 }}
        >
          <div
            aria-hidden
            className='mb-8 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white text-rose-700 shadow-xl'
            onClick={onClick}
          >
            <span className='icon-[mdi--cog-pause-outline] size-6' />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
