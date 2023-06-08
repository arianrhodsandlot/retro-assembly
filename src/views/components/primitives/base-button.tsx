import clsx from 'clsx'
import { type JSX, forwardRef } from 'react'

type ButtonProps = JSX.IntrinsicElements['button']
interface BaseButtonProps extends ButtonProps {
  styleType?: 'primary' | 'normal'
}

export const BaseButton = forwardRef<HTMLButtonElement, BaseButtonProps>(function BaseButton(
  { styleType = 'normal', children, className, ...props },
  ref
) {
  return (
    <button
      className={clsx(
        ['flex items-center justify-center gap-2 rounded border-2 border-red-600 px-4 py-2 focus:animate-pulse'],
        { 'bg-white text-red-600': styleType === 'normal' },
        { 'bg-red-600 text-white': styleType === 'primary' },
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})
