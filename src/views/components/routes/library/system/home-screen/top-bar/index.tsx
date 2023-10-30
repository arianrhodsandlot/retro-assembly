import { useAtomValue } from 'jotai'
import { systemsAtom } from '../atoms'
import { Logo } from './logo'
import { SystemNavigation } from './system-navigation'
import { TopBarDropdown } from './top-bar-dropdown'

export function TopBar() {
  const systems = useAtomValue(systemsAtom)

  return (
    <div
      className='system-navigation z-[1] flex h-16 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-black bg-rose-700 text-white'
      data-testid='system-navigation'
    >
      <Logo />
      {systems?.length ? <SystemNavigation /> : <div className='flex-1' />}
      <TopBarDropdown />
    </div>
  )
}
