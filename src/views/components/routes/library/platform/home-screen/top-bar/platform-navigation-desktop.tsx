import { PlatformNavigationItem } from './platform-navigation-item'

interface PlatformNavigationDesktopProps {
  platforms: { name: string; fullName: string }[]
  current?: { name: string; fullName: string }
}

export function PlatformNavigationDesktop({ platforms, current }: PlatformNavigationDesktopProps) {
  return (
    <div className='platform-navigation hidden flex-1 flex-nowrap overflow-x-auto overflow-y-hidden sm:flex'>
      {platforms.map((platform) => (
        <PlatformNavigationItem highlighted={platform === current} key={platform.name} platform={platform} />
      ))}
    </div>
  )
}
