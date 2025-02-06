import { clsx } from 'clsx'
import type { JSX } from 'react'
import { isTouchDevice } from '../../../lib/utils'
import { useGamepads } from '../input-tips/hooks/use-gamepads'

type IntrinsicButtonProps = Partial<JSX.IntrinsicElements['button']>

interface GameEntryButtonProps extends IntrinsicButtonProps {
  isFirstColumn: boolean
  isFirstRow: boolean
  isLastColumn: boolean
  isLastRow: boolean
}

export function GameEntryButton({
  children,
  isFirstColumn,
  isFirstRow,
  isLastColumn,
  isLastRow,
  ...props
}: GameEntryButtonProps) {
  const { connected } = useGamepads()
  const shouldScaleWhenFocus = connected || !isTouchDevice()

  return (
    <button className='group relative' type='button' {...props} data-testid='game-entry-button'>
      <div
        className={clsx(
          'opacity-1 block size-full bg-gray-100 text-left transition-transform group-focus:transform-gpu',
          'after:pointer-events-none after:absolute after:inset-0 after:border-b after:border-black',
          { 'after:border-r': !isLastColumn },
          { 'relative group-focus:z-10 group-focus:shadow-2xl group-focus:shadow-black': shouldScaleWhenFocus },
          {
            'group-focus:scale-125 group-focus:after:-inset-[4px] group-focus:after:animate-[pulse-white-border_1.5s_ease-in-out_infinite] group-focus:after:border-4':
              shouldScaleWhenFocus,
          },
          {
            'origin-top-left group-focus:left-[4px] group-focus:top-[4px]': isFirstRow && isFirstColumn,
            'origin-top-right group-focus:-left-[4px] group-focus:top-[4px]': isFirstRow && isLastColumn,
            'origin-top group-focus:top-[4px]': isFirstRow && !isFirstColumn && !isLastColumn,

            'origin-center': !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
            'origin-left group-focus:left-[4px]': !isFirstRow && isFirstColumn && !isLastRow,
            'origin-right group-focus:-left-[4px]': !isFirstRow && !isLastRow && isLastColumn,

            'origin-bottom-left group-focus:-top-[5px] group-focus:left-[4px]': isLastRow && isFirstColumn,
            'origin-bottom-right group-focus:-left-[4px] group-focus:-top-[5px]': isLastRow && isLastColumn,
            'origin-bottom group-focus:-top-[5px]': isLastRow && !isFirstColumn && !isLastColumn,
          },
        )}
      >
        {children}
      </div>
    </button>
  )
}
