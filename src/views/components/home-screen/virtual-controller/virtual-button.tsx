import { clsx } from 'clsx'
import { type ReactNode, type UIEvent, useState } from 'react'
import { pressController } from '../../../../core'

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
    event.stopPropagation()
    release()
  }

  function onTouchStart(event: UIEvent<HTMLDivElement>) {
    event.stopPropagation()
    press()
  }

  return (
    <div
      aria-hidden
      className={clsx(
        'flex h-full w-full select-none items-center justify-center text-xs uppercase',
        canPress && pressing ? 'bg-white/50 text-black/50' : 'bg-transparent text-white/50',
      )}
      onContextMenu={onContextMenu}
      onTouchEnd={onTouchEnd}
      onTouchStart={onTouchStart}
    >
      {children}
    </div>
  )
}
