import { clsx } from 'clsx'
import { motion } from 'framer-motion'
import { type UIEvent, useState } from 'react'
import { pressController } from '../../../../core'

interface VirtualButtonProps {
  name?: string
  onTap?: () => void
}

export function VirtualButton({ name, onTap }: VirtualButtonProps) {
  const [pressing, setPressing] = useState(false)

  function onPress(event: UIEvent<HTMLDivElement>) {
    event.stopPropagation()
    setPressing(true)
    if (name) {
      for (const n of name.split(',')) {
        pressController(n, 'down')
      }
    }

    onTap?.()
  }

  function onRelease(event: UIEvent<HTMLDivElement>) {
    event.stopPropagation()
    if (pressing) {
      setPressing(false)
      if (name) {
        for (const n of name.split(',')) {
          pressController(n, 'up')
        }
      }
    }
  }

  return (
    <motion.div
      animate={{ opacity: 1 }}
      aria-hidden
      className={clsx(
        'flex h-full w-full select-none items-center justify-center text-transparent',
        pressing ? 'bg-white' : 'bg-transparent',
      )}
      exit={{ opacity: 0 }}
      initial={{ opacity: 0 }}
      onMouseDown={onPress}
      onMouseLeave={onRelease}
      onMouseUp={onRelease}
      onTouchEnd={onRelease}
      onTouchStart={onPress}
      transition={{ duration: 0.2 }}
    >
      {name}
    </motion.div>
  )
}
