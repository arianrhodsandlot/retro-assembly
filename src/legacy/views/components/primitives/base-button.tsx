import { clsx } from 'clsx'
import { createElement, type JSX } from 'react'

type ButtonProps = JSX.IntrinsicElements['button']
interface BaseButtonProps extends ButtonProps {
  href?: string
  styleType?: 'normal' | 'primary'
  tag?: 'a' | 'button'
  target?: string
}

export function BaseButton({
  children,
  className,
  ref,
  styleType = 'normal',
  tag = 'button',
  ...props
}: { ref?: React.RefObject<HTMLButtonElement | null> } & BaseButtonProps) {
  return createElement(
    tag,
    {
      className: clsx(
        ['relative rounded border-2 border-rose-700 px-4 py-2'],
        { 'bg-white text-rose-700': styleType === 'normal' },
        { 'bg-rose-700 text-white': styleType === 'primary' },
        'focus:rounded-none',
        'focus:before:absolute focus:before:-inset-2 focus:before:animate-[pulse-rose-border_1.5s_ease-in-out_infinite] focus:before:rounded focus:before:border-8',
        className,
      ),
      ref,
      ...props,
    },
    <div className='flex-center relative gap-2'>{children}</div>,
  )
}
