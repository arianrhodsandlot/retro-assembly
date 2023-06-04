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
    <button className='group relative bg-[#eee]' {...props}>
      <span
        className={clsx(
          'opacity-1 block h-full w-full bg-[#eee] text-left transition-[transform] group-focus:transform-gpu',
          'after:absolute after:-inset-0 after:border after:border-black',
          'group-focus:relative group-focus:z-10 group-focus:scale-110 group-focus:shadow-2xl group-focus:shadow-black',
          'group-focus:after:-inset-[4px] group-focus:after:animate-pulse group-focus:after:border-[4px] group-focus:after:border-white',
          {
            'group-focus:origin-top-left group-focus:translate-x-[4px] group-focus:translate-y-[4px]':
              isFirstRow && isFirstColumn,
            'group-focus:origin-top group-focus:translate-y-[4px]': isFirstRow && !isFirstColumn && !isLastColumn,
            'group-focus:origin-top-right group-focus:-translate-x-[4px] group-focus:translate-y-[4px]':
              isFirstRow && isLastColumn,

            'group-focus:origin-left group-focus:translate-x-[4px]': !isFirstRow && isFirstColumn && !isLastRow,
            'group-focus:origin-center': !isFirstRow && !isLastRow && !isFirstColumn && !isLastColumn,
            'group-focus:origin-right group-focus:-translate-x-[4px]': !isFirstRow && isLastColumn,

            'group-focus:origin-bottom-left group-focus:-translate-y-[4px] group-focus:translate-x-[4px]':
              isLastRow && isFirstColumn,
            'group-focus:origin-bottom group-focus:-translate-y-[4px]': isLastRow && !isFirstColumn && !isLastColumn,
            'group-focus:origin-bottom-right group-focus:-translate-x-[4px] group-focus:-translate-y-[4px]':
              isLastRow && isLastColumn,
          }
        )}
      >
        {children}
      </span>
    </button>
  )
}
