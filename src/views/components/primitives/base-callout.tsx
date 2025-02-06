import { clsx } from 'clsx'
import type { ReactNode } from 'react'

export function BaseCallout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('rounded border border-rose-700 bg-rose-100 px-4 py-2 text-sm text-rose-700', className)}>
      {children}
    </div>
  )
}
