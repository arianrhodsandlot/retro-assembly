import type { JSX } from 'react'

type BaseKbdProps = Partial<JSX.IntrinsicElements['kbd']>

export function LightInputButton({ children, ...props }: BaseKbdProps) {
  return (
    <kbd className='flex h-4 items-center justify-center rounded bg-white px-1 text-xs font-bold text-black' {...props}>
      {children}
    </kbd>
  )
}
