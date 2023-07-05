import { ClearSiteDataButton } from './clear-site-data-button'
import { Logo } from './logo'
import { SystemNavigation } from './system-navigation'

export function TopBar() {
  return (
    <div className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-auto overflow-x-hidden border-b border-black bg-rose-700 text-white'>
      <Logo />
      <SystemNavigation />
      <ClearSiteDataButton />
    </div>
  )
}
