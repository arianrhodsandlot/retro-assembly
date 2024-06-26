import { AnimatePresence, type AnimationLifecycles , type AnimationProps, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GameLaunchingImageProps {
  show: boolean
  styles: {
    initial: AnimationProps['initial']
    animate: AnimationProps['animate']
    exit: AnimationProps['exit']
  }
  onAnimationComplete: AnimationLifecycles['onAnimationComplete']
  onAnimationStart: AnimationLifecycles['onAnimationStart']
  children: ReactNode
}

export function GameLaunchingImage({
  show,
  styles,
  onAnimationComplete,
  onAnimationStart,
  children,
}: GameLaunchingImageProps) {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          animate={styles.animate}
          className='pointer-events-none absolute z-10 overflow-hidden'
          exit={styles.exit}
          initial={styles.initial}
          onAnimationComplete={onAnimationComplete}
          onAnimationStart={onAnimationStart}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
