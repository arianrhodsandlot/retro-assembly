import { ClearSiteDataButton } from './clear-site-data-button'
import { Logo } from './logo'
import { SystemNavigation } from './system-navigation'

export function TopBar({ systems }: { systems?: any[] }) {
  return (
    <div className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-auto overflow-x-hidden bg-red-600 to-red-700 text-white shadow-sm shadow-gray-700'>
      <Logo />
      <SystemNavigation />
      <ClearSiteDataButton />
    </div>
  )
}
