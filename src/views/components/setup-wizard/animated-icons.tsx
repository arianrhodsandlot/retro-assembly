import clsx from 'clsx'
import delay from 'delay'
import { useState } from 'react'
import { useInterval } from 'react-use'

export function AnimatedIcons({ wait = 0, children }: { wait?: number; children: any }) {
  const [frames, setFrames] = useState(0)
  const [enableAnimation, setEnableAnimation] = useState(true)

  useInterval(async () => {
    if (wait) {
      await delay(wait)
    }
    const nextFrames = frames + 1
    setFrames(nextFrames)
    if (nextFrames >= children.length) {
      await delay(300)
      setEnableAnimation(false)
      setFrames(0)

      await delay(300)
      setEnableAnimation(true)
    }
  }, 1500)

  return (
    <div className='relative mr-2 h-4 w-4 overflow-hidden'>
      <div
        className={clsx('absolute flex flex-col', {
          'transition-transform duration-300': enableAnimation,
        })}
        style={{
          transform: `translateY(-${(100 / (children.length + 1)) * frames}%)`,
        }}
      >
        {children}
        {children[0]}
      </div>
    </div>
  )
}
