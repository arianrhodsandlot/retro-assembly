import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface IconShortcutButtonProps {
  children: ReactNode
  onClick?: () => void
  type: string
}

export function IconShortcutButton({
  children,
  onClick,
  ref,
  type,
}: { ref?: React.RefObject<HTMLButtonElement | null> } & IconShortcutButtonProps) {
  return (
    <button
      className={clsx(
        'flex-center rounded p-1 transition-[background,transform]',
        'focus:scale-105 focus:bg-white',
        'hover:scale-105 hover:bg-white',
      )}
      data-testid={`select-${type}-directory`}
      onClick={onClick}
      ref={ref}
      type='button'
    >
      {children}
    </button>
  )
}
