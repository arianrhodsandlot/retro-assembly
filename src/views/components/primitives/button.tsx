import clsx from 'clsx'
import { type JSX } from 'react'

type ButtonProps = JSX.IntrinsicElements['button']
interface BaseButtonProps extends ButtonProps {
  styleType?: 'primary' | 'normal'
}

export function BaseButton({ styleType = 'normal', icon, children, className, ...props }: BaseButtonProps) {
  return (
    <button
      className={clsx(
        ['flex items-center justify-center gap-2 rounded border-2 border-red-600 px-3 py-1 focus:animate-pulse'],
        { 'bg-white text-red-600': styleType === 'normal' },
        { 'bg-red-600 text-white': styleType === 'primary' },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
