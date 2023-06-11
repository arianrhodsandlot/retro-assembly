import { clsx } from 'clsx'
import React from 'react'

type IntrinsicButtonProps = Partial<React.JSX.IntrinsicElements['button']>

interface GameEntryButtonProps extends IntrinsicButtonProps {
  isFirstRow: boolean
  isFirstColumn: boolean
  isLastRow: boolean
  isLastColumn: boolean
}

export function GameEntryButton({
  children,
  isFirstRow,
  isFirstColumn,
  isLastRow,
  isLastColumn,
  ...props
}: GameEntryButtonProps) {
  return (
    <button className='group relative' {...props}>
      <div
        className={clsx(
          'opacity-1 block h-full w-full bg-gray-100 text-left transition-transform group-focus:transform-gpu',
          'after:absolute after:-inset-0 after:border after:border-black',
          'relative group-focus:z-10 group-focus:scale-125 group-focus:shadow-2xl group-focus:shadow-black',
          'group-focus:after:-inset-[4px] group-focus:after:animate-[pulse-white-border_1.5s_ease-in-out_infinite] group-focus:after:border-4',
          {
            'origin-top-left group-focus:left-[4px] group-focus:top-[4px]': isFirstRow && isFirstColumn,
            'origin-top group-focus:top-[4px]': isFirstRow && !isFirstColumn && !isLastColumn,
            'origin-top-right group-focus:-left-[4px] group-focus:top-[4px]': isFirstRow && isLastColumn,

            'origin-left group-focus:left-[4px]': !isFirstRow && isFirstColumn && !isLastRow,
            'origin-center': !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
            'origin-right group-focus:-left-[4px]': !isFirstRow && !isLastRow && isLastColumn,

            'origin-bottom-left group-focus:-top-[5px] group-focus:left-[4px]': isLastRow && isFirstColumn,
            'origin-bottom group-focus:-top-[5px]': isLastRow && !isFirstColumn && !isLastColumn,
            'origin-bottom-right group-focus:-left-[4px] group-focus:-top-[5px]': isLastRow && isLastColumn,
          }
        )}
      >
        {children}
      </div>
    </button>
  )
}
