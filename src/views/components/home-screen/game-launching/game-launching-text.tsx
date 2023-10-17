import { AnimatePresence, motion } from 'framer-motion'
import { BouncingEllipsis } from '../../common/bouncing-ellipsis'
import { LoadingScreen } from '../../common/loading-screen'

export function GameLaunchingText({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={{ opacity: 1 }}
          className='absolute inset-0 z-[11] select-none'
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <LoadingScreen>
            Now loading
            <BouncingEllipsis />
          </LoadingScreen>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
