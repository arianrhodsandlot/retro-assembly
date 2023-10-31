import { clsx } from 'clsx'
import { type ReactNode, forwardRef } from 'react'

interface IconShortcutButtonProps {
  type: string
  children: ReactNode
  onClick?: () => void
}

export const IconShortcutButton = forwardRef<HTMLButtonElement, IconShortcutButtonProps>(function IconShortcutButton(
  { type, onClick, children },
  ref,
) {
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
    >
      {children}
    </button>
  )
})
