import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { showMenuOverlayAtom } from '../../atoms'
import { useMouseMoving } from './hooks'

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
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
          transition={{ duration: 0.1 }}
        >
          <div
            aria-hidden
            className='mb-8 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-white text-rose-700 shadow-xl'
            onClick={onClick}
          >
            <span className='icon-[mdi--cog-pause-outline] h-6 w-6' />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
