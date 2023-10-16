import { clsx } from 'clsx'
import { type UIEvent, useState } from 'react'
import { pressController } from '../../../../core'

interface VirtualButtonProps {
  name: string
}

export function VirtualButton({ name }: VirtualButtonProps) {
  const [pressing, setPressing] = useState(false)

  function onPress(event: UIEvent<HTMLDivElement>) {
    event.stopPropagation()
    setPressing(true)
    pressController(name, 'down')
  }

  function onRelease(event: UIEvent<HTMLDivElement>) {
    event.stopPropagation()
    if (pressing) {
      setPressing(false)
      pressController(name, 'up')
    }
  }

  return (
    <div
      aria-hidden
      className={clsx(
        'flex h-full w-full select-none items-center justify-center text-transparent',
        pressing ? 'bg-white' : 'bg-transparent',
      )}
      onMouseDown={onPress}
      onMouseLeave={onRelease}
      onMouseUp={onRelease}
      onTouchEnd={onRelease}
      onTouchStart={onPress}
    >
      {name}
    </div>
  )
}
