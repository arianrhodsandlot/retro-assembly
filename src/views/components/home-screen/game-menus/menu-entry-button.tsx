import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { detectHasRunningGame } from '../../../../core'
import { showMenuOverlayAtom } from './atoms'
import { useMouseMoving } from './hooks'

export function MenuEntryButton({ onClick }: { onClick: () => void }) {
  const showMenuOverlay = useAtomValue(showMenuOverlayAtom)
  const { isMouseMoving } = useMouseMoving({ timeout: 3000 })

  const showMenuEntryButton = detectHasRunningGame() && isMouseMoving && !showMenuOverlay

  return (
    <AnimatePresence>
      {showMenuEntryButton ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden
          className='absolute bottom-10 right-10 z-20 flex h-12 cursor-pointer items-center justify-center rounded bg-rose-700 px-6 text-white shadow-xl'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClick}
          transition={{ duration: 0.1 }}
        >
          <span className='icon-[mdi--menu] mr-2 h-8 w-8' /> Menu
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
