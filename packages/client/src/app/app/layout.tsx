import type { ReactNode } from 'react'
import { SidebarLinks } from './components/sidebar-links'

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='flex h-screen'>
      <aside className='bg-[var(--theme)] text-white flex flex-col w-56 h-full overflow-auto'>
        <div className='py-4 text-center font-bold'>RetroAssembly</div>

        <SidebarLinks />
      </aside>

      <div className='flex-1 bg-rose-700 h-full flex'>
        <div className='shadow-lg shadow-neutral-800 rounded-lg mr-4 my-4 flex-1 overflow-hidden flex'>
          <div className='flex-1 overflow-auto bg-zinc-100 p-4'>{children}</div>
        </div>
      </div>
    </div>
  )
}
