import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface TopBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  highlighted?: boolean
}

export const TopBarButton = forwardRef<HTMLButtonElement, TopBarButtonProps>(function TopBarButton(
  { children, highlighted = false, className, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      {...props}
      className={clsx(
        'relative border-r border-red-700 text-sm transition-[opacity,background-color] first:border-l',
        'after:absolute after:inset-0 after:z-0 after:shadow-inner after:transition-[background-color,border-width]',
        { 'after:bg-white': highlighted },
        highlighted ? 'hover:after:bg-white' : 'hover:after:bg-red-700',
        highlighted ? 'focus:after:bg-white' : 'focus:after:bg-red-700',
        'focus:after:rounded-sm focus:after:border-4',
        'focus:after:animate-[pulse-red-border_1.5s_ease-in-out_infinite]',
        className
      )}
    >
      {children}
    </button>
  )
})
