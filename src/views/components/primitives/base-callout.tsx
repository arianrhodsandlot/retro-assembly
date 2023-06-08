import { clsx } from 'clsx'
import { type ReactNode } from 'react'

export function BaseCallout({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={clsx('rounded border border-red-600 bg-red-100 px-4 py-2 text-sm text-red-600', className)}>
      {children}
    </div>
  )
}
