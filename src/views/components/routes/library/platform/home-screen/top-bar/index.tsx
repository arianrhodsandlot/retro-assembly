import { useAtomValue } from 'jotai'
import { platformsAtom } from '../atoms'
import { Logo } from './logo'
import { PlatformNavigation } from './platform-navigation'
import { TopBarDropdown } from './top-bar-dropdown'

export function TopBar() {
  const platforms = useAtomValue(platformsAtom)

  return (
    <div
      className='platform-navigation z-[1] flex h-16 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-black bg-rose-700 text-white'
      data-testid='platform-navigation'
    >
      <Logo />
      {platforms?.length ? <PlatformNavigation /> : <div className='flex-1' />}
      <TopBarDropdown />
    </div>
  )
}
