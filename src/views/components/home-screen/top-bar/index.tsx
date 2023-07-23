import { Logo } from './logo'
import { SystemNavigation } from './system-navigation'
import { TopBarDropDown } from './top-bar-dropdown'

export function TopBar() {
  return (
    <div className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-black bg-rose-700 text-white'>
      <Logo />
      <SystemNavigation />
      <TopBarDropDown />
    </div>
  )
}
