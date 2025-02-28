import type { ReactNode } from 'react'
import { getC } from '@/utils/misc.ts'
import { SidebarLinks } from './sidebar-links.tsx'

interface AppLayoutProps {
  children: ReactNode
  sidebar?: ReactNode
}

const defaultSidebar = <SidebarLinks />
export default function AppLayout({ children, sidebar = defaultSidebar }: AppLayoutProps) {
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
        <main
          className='my-4 mr-4 flex-1 overflow-auto rounded-lg'
          key={c.req.path}
          style={{ boxShadow: '0 0 16px rgba(0,0,0,.5)' }}
        >
          <div className='min-h-full bg-zinc-50 p-4'>{children}</div>
        </main>
      </div>
    </div>
  )
}
