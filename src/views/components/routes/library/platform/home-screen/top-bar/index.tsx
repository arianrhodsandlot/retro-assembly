import { useAtomValue } from 'jotai'
import { useRouterHelpers } from '../../../../../hooks/use-router-helpers'
import { platformsAtom } from '../atoms'
import { Logo } from './logo'
import { PlatformNavigation } from './platform-navigation'
import { TopBarDropdown } from './top-bar-dropdown'
import { TopBarLink } from './top-bar-link'

export function TopBar() {
  const platforms = useAtomValue(platformsAtom)
  const { params } = useRouterHelpers()

  return (
    <div
      className='platform-navigation z-[1] flex h-16 w-full items-stretch overflow-x-auto overflow-y-hidden border-b border-black bg-rose-700 text-white'
      data-testid='platform-navigation'
    >
      <Logo />
      {platforms?.length ? <PlatformNavigation /> : <div className='flex-1' />}
      <TopBarDropdown />
      {params.library === 'public' ? <TopBarLink /> : null}
    </div>
  )
}
