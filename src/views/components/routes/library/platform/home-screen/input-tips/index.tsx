import { useEventListener } from '@react-hookz/web'
import delay from 'delay'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { InputTipsContent } from './input-tips-content'

async function hasIntersection(element1: HTMLElement, element2: HTMLElement) {
  if (!element1 || !element2) {
    return false
  }

  let rect1 = element1.getBoundingClientRect()
  let rect2 = element2.getBoundingClientRect()

  // wait for scrolling
  if (rect1.bottom !== document.body.clientHeight) {
    await delay(300)
  }

  rect1 = element1.getBoundingClientRect()
  rect2 = element2.getBoundingClientRect()

  return rect1.bottom > rect2.top && rect1.top < rect2.bottom && rect1.right > rect2.left && rect1.left < rect2.right
}

export function InputTips() {
  const [shouldMoveToLeft, setShouldMoveToLeft] = useState(false)
  const ref = useRef(null)

  useEventListener(
    document.body,
    'focus',
    async (e: FocusEvent) => {
      const button = e.target as HTMLButtonElement
      if (!button || !ref.current) {
        return
      }
      const gameEntryGrid = button.parentElement?.parentElement
      if (!gameEntryGrid) {
        return
      }
      if (await hasIntersection(button, ref.current)) {
        if (!shouldMoveToLeft) {
          setShouldMoveToLeft(true)
        }
      } else if (shouldMoveToLeft) {
        setShouldMoveToLeft(false)
      }
    },
    { capture: true },
  )

  return (
    <>
      <div className='pointer-events-none invisible fixed bottom-0 right-0' ref={ref}>
        <InputTipsContent />
      </div>

      <AnimatePresence>
        {shouldMoveToLeft ? (
          <motion.div
            animate={{ y: 0 }}
            className='fixed bottom-0 left-0 overflow-hidden rounded-tr-xl shadow shadow-black'
            exit={{ y: '100%' }}
            initial={{ y: '100%' }}
            key={'left'}
            transition={{ easings: 'linear' }}
          >
            <InputTipsContent />
          </motion.div>
        ) : (
          <motion.div
            animate={{ y: 0 }}
            className='fixed bottom-0 right-0 overflow-hidden rounded-tl-xl shadow shadow-black'
            exit={{ y: '100%' }}
            initial={{ y: '100%' }}
            key={'right'}
            transition={{ easings: 'linear' }}
          >
            <InputTipsContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
