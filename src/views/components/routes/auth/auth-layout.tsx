import { type ReactNode } from 'react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return <div className='flex h-screen items-center justify-center gap-2 pt-10 text-center text-lg'>{children}</div>
}
