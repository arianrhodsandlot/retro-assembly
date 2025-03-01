import type { ReactNode } from 'react'
import { getC } from '@/utils/misc.ts'
import { SidebarLinks } from './sidebar-links.tsx'

interface AppLayoutProps {
  append?: ReactNode
  children: ReactNode
  sidebar?: ReactNode
}

const defaultSidebar = <SidebarLinks />
export default function AppLayout({ append, children, sidebar = defaultSidebar }: AppLayoutProps) {
  const c = getC()

  return (
    <div className='flex h-screen bg-[var(--theme)]'>
      <aside className='flex h-full w-64 flex-col overflow-auto text-white'>
        <div className='flex items-center justify-center gap-2 py-4 font-bold'>
          <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
          RetroAssembly
        </div>

        {sidebar}
      </aside>

      <div className='flex h-full flex-1'>
        <div className='relative m-4 flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
          <main className='z-1 relative flex-1 overflow-auto' key={c.req.path}>
            <div className='min-h-full p-4'>{children}</div>
          </main>
          {append}
        </div>
      </div>
    </div>
  )
}
