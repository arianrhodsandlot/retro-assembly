import type { ReactNode } from 'react'
import { getC } from '@/utils/misc.ts'
import { ScrollContainer } from './scroll-container.tsx'
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
      <aside className='flex flex-col'>
        <div className='flex items-center justify-center gap-2 pb-4 pt-2 font-bold text-white'>
          <img alt='logo' height='32' src='/assets/logo/logo-192x192.png' width='32' />
          RetroAssembly
        </div>
        <ScrollContainer className='flex-1'>{sidebar}</ScrollContainer>
      </aside>

      <div className='flex h-full flex-1'>
        <div className='relative my-4 mr-4 flex flex-1 overflow-hidden rounded bg-zinc-50 shadow-[0_0_12px] shadow-black/10'>
          <ScrollContainer className='z-1 relative flex-1' key={c.req.path}>
            <main className='min-h-full p-4'>{children}</main>
          </ScrollContainer>
          {append}
        </div>
      </div>
    </div>
  )
}
