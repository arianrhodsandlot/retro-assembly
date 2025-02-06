import { AnimatePresence, type AnimationLifecycles, type AnimationProps, motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface GameLaunchingImageProps {
  children: ReactNode
  onAnimationComplete: AnimationLifecycles['onAnimationComplete']
  onAnimationStart: AnimationLifecycles['onAnimationStart']
  show: boolean
  styles: {
    animate: AnimationProps['animate']
    exit: AnimationProps['exit']
    initial: AnimationProps['initial']
  }
}

export function GameLaunchingImage({
  children,
  onAnimationComplete,
  onAnimationStart,
  show,
  styles,
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
