import '@/styles/index.ts'
import type { ReactNode } from 'react'

export function Root({ children }: { children: ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <title>RetroAssembly</title>
      </head>
      <body>{children}</body>
    </html>
  )
}
