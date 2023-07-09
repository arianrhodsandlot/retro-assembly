import { type JSX } from 'react'

type BaseKbdProps = Partial<JSX.IntrinsicElements['kbd']>

export function ButtonOnInputDevice({ children, ...props }: BaseKbdProps) {
  return (
    <kbd className='flex h-4 w-6 items-center justify-center rounded bg-white text-xs font-bold text-black' {...props}>
      {children}
    </kbd>
  )
}
