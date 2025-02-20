import Image from 'next/image'
import type { ReactNode } from 'react'
import { SidebarLinks } from './components/sidebar-links.tsx'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='flex h-screen'>
      <aside className='flex h-full w-56 flex-col overflow-auto bg-[var(--theme)] text-white'>
        <div className='flex items-center justify-center gap-2 py-4 font-bold'>
          <Image alt='logo' height='32' src='/logo/logo-192x192.png' width='32' />
          RetroAssembly
        </div>

        <SidebarLinks />
      </aside>

      <div className='flex h-full flex-1 bg-rose-700'>
        <div className='my-4 mr-4 flex flex-1 overflow-hidden rounded-lg shadow-lg shadow-neutral-800'>
          <div className='flex flex-1 overflow-auto bg-zinc-100 p-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
