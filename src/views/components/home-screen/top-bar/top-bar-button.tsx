import { clsx } from 'clsx'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface TopBarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  highlighted?: boolean
}

export const TopBarButton = forwardRef<HTMLButtonElement, TopBarButtonProps>(function TopBarButton(
  { children, highlighted = false, className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type='button'
      {...props}
      className={clsx(
        'relative h-16 text-sm transition-[opacity,background-color]',
        'after:absolute after:inset-0 after:z-0 after:transition-[background-color,border-width]',
        { 'after:bg-white': highlighted },
        highlighted ? 'hover:after:bg-white' : 'hover:after:bg-rose-900',
        highlighted ? 'focus:after:bg-white' : 'focus:after:bg-rose-900',
        'focus:after:rounded-sm focus:after:border-4',
        'focus:after:animate-[pulse-rose-border_1.5s_ease-in-out_infinite]',
        className,
      )}
    >
      <div className='relative z-[1] flex items-center'>{children}</div>
    </button>
  )
})
