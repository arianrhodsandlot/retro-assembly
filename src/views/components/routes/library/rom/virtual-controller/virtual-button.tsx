import { clsx } from 'clsx'
import { type ReactNode, type UIEvent, useState } from 'react'
import { pressController } from '../../../../../../core'

interface VirtualButtonProps {
  name?: string
  onTap?: () => void
  children?: ReactNode
}

function onContextMenu(event: UIEvent<HTMLDivElement>) {
  event.preventDefault()
  event.stopPropagation()
}

export function VirtualButton({ name, onTap, children }: VirtualButtonProps) {
  const [pressing, setPressing] = useState(false)
  const canPress = Boolean(name || onTap)

  function press() {
    setPressing(true)
    if (name) {
      for (const n of name.split(',')) {
        pressController(n, 'down')
      }
    }

    onTap?.()
  }

  function release() {
    if (pressing) {
      setPressing(false)
      if (name) {
        for (const n of name.split(',')) {
          pressController(n, 'up')
        }
      }
    }
  }

  function onTouchEnd(event: UIEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    release()
  }

  function onTouchStart(event: UIEvent<HTMLDivElement>) {
    event.preventDefault()
    event.stopPropagation()
    press()
  }

  return (
    <div
      aria-hidden
      className={clsx(
        'flex size-full touch-none select-none items-center justify-center text-sm font-extrabold uppercase',
        canPress && pressing ? 'bg-white text-black' : 'bg-transparent text-white/40',
      )}
      onContextMenu={onContextMenu}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      {children}
    </div>
  )
}
