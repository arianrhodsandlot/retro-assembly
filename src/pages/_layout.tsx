import '@/styles/index.ts'
import type { ReactNode } from 'react'

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return <body className='antialiased'>{children}</body>
}
