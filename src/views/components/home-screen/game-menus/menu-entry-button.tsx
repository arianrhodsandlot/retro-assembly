import { AnimatePresence, motion } from 'framer-motion'
import { useAtomValue } from 'jotai'
import { detectHasRunningGame } from '../../../../core'
import { isGameRunningAtom } from '../../atoms'
import { showMenuOverlayAtom } from './atoms'
import { useMouseMoving } from './hooks'

export function MenuEntryButton({ onClick }: { onClick: () => void }) {
  const isGameRunning = useAtomValue(isGameRunningAtom)
  const showMenuOverlay = useAtomValue(showMenuOverlayAtom)
  const { isMouseMoving } = useMouseMoving({ timeout: 3000 })

  const showMenuEntryButton = isGameRunning && detectHasRunningGame() && isMouseMoving && !showMenuOverlay

  return (
    <AnimatePresence>
      {showMenuEntryButton ? (
        <motion.div
          animate={{ opacity: 1 }}
          aria-hidden
          className='fixed bottom-10 right-10 z-20 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-white text-rose-700 shadow-xl'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          onClick={onClick}
          transition={{ duration: 0.1 }}
        >
          <span className='icon-[mdi--cog-pause-outline] h-8 w-8' />
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
