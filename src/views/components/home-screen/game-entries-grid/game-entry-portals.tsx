import { AnimatePresence, motion } from 'framer-motion'
import { useAtom } from 'jotai'
import { createPortal } from 'react-dom'
import { useWindowSize } from 'react-use'
import { isGameLaunchingAtom } from '../../atoms'
import { BouncingEllipsis } from '../../common/bouncing-ellipsis'
import { LoadingScreen } from '../../common/loading-screen'

export function GameEntryPortals({
  maskContent,
  maskPosition,
  onMaskShow,
}: {
  maskContent: any
  maskPosition: any
  onMaskShow: () => Promise<void>
}) {
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [isGameLaunching, setIsGameLaunching] = useAtom(isGameLaunchingAtom)
  const maskInitialStyle = { ...maskPosition, filter: 'brightness(1)' }
  const maskExpandedStyle = {
    ...maskPosition,
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    filter: 'brightness(0)',
  }

  async function onAnimationComplete(definition) {
    if (definition === maskExpandedStyle) {
      setIsGameLaunching(true)
      await onMaskShow()
      setIsGameLaunching(false)
    }
  }

  return createPortal(
    <>
      <AnimatePresence>
        {maskPosition ? (
          <motion.div
            animate={maskExpandedStyle}
            className='absolute z-10 overflow-hidden'
            exit={maskInitialStyle}
            initial={maskInitialStyle}
            onAnimationComplete={onAnimationComplete}
            transition={{ duration: 0.2 }}
          >
            {maskContent}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {maskPosition && isGameLaunching ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='absolute inset-0 z-[11]'
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
    </>,
    document.body,
  )
}
