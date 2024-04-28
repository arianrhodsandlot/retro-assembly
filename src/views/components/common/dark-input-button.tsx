import type { JSX } from 'react'

type BaseKbdProps = Partial<JSX.IntrinsicElements['kbd']>

export function DarkInputButton({ children, ...props }: BaseKbdProps) {
  return (
    <kbd className='flex h-4 items-center justify-center rounded bg-black px-1 text-xs font-bold text-white' {...props}>
      {children}
    </kbd>
  )
}
