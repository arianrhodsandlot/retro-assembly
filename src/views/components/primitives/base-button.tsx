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
        ['relative rounded border-2 border-red-600 px-4 py-2'],
        { 'bg-white text-red-600': styleType === 'normal' },
        { 'bg-red-600 text-white': styleType === 'primary' },
        'focus:rounded-none',
        'focus:before:absolute focus:before:-inset-2 focus:before:animate-[pulse-red-border_1.5s_ease-in-out_infinite] focus:before:rounded focus:before:border-8',
        className
      )}
      ref={ref}
      {...props}
    >
      <div className='relative z-[1] flex items-center justify-center gap-2'>{children}</div>
    </button>
  )
})
