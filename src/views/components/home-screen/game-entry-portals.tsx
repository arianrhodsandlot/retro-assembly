import { clsx } from 'clsx'
import { AnimatePresence, type Target, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useWindowSize } from 'react-use'
import { type Rom, game, getCover } from '../../../core'
import { emitter } from '../../lib/emitter'

export function GameEntryPortals({
  maskContent,
  maskPosition,
  onMaskShow,
  onMaskHide,
}: {
  maskContent: any
  maskPosition: any
  onMaskShow: () => Promise<void>
  onMaskHide: () => void
}) {
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  const [isLaunching, setIsLaunching] = useState(false)
  const maskInitialStyle = { ...maskPosition, filter: 'brightness(1)' }
  const maskExpandedStyle = {
    ...maskPosition,
    top: 0,
    left: 0,
    width: windowWidth,
    height: windowHeight,
    filter: 'brightness(.05)',
  }

  async function onAnimationComplete(definition) {
    if (definition === maskExpandedStyle) {
      emitter.on('exit', () => {
        onMaskHide()

        emitter.off('exit')
      })

      setIsLaunching(true)
      await onMaskShow()
      setIsLaunching(false)
    }

    if (definition === maskInitialStyle) {
      game.exit()
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
        {isLaunching ? (
          <motion.div
            animate={{ opacity: 1 }}
            className='absolute inset-0 z-[11] flex items-center justify-center backdrop-blur-xl'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className='icon-[line-md--loading-twotone-loop] text-white' />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>,
    document.body
  )
}
