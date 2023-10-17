import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { detectHasRunningGame } from '../../../../core'
import { isGameRunningAtom, showMenuOverlayAtom } from '../../atoms'
import { useMouseMoving } from './hooks'

function isTouchDevice() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function MenuEntryButton({ onClick }: { onClick: () => void }) {
  const isGameRunning = useAtomValue(isGameRunningAtom)
  const showMenuOverlay = useAtomValue(showMenuOverlayAtom)
  const { isMouseMoving } = useMouseMoving({ timeout: 3000 })

  const showMenuEntryButton = isGameRunning && detectHasRunningGame() && isMouseMoving && !showMenuOverlay

  if (isTouchDevice()) {
    return null
  }

  return (
    <AnimatePresence>
      {showMenuEntryButton ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='pointer-events-none fixed inset-0 z-20 flex items-end justify-center bg-black/50'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          <div
            aria-hidden
            className='mb-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-rose-700 shadow-xl'
            onClick={onClick}
          >
            <span className='icon-[mdi--cog-pause-outline] h-8 w-8' />
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
