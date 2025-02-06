import { PlatformNavigationItem } from './platform-navigation-item'

interface PlatformNavigationDesktopProps {
  current?: { fullName: string; name: string }
  platforms: { fullName: string; name: string }[]
}

export function PlatformNavigationDesktop({ current, platforms }: PlatformNavigationDesktopProps) {
  return (
    <div className='platform-navigation hidden flex-1 flex-nowrap overflow-x-auto overflow-y-hidden sm:flex'>
      {platforms.map((platform) => (
        <PlatformNavigationItem highlighted={platform === current} key={platform.name} platform={platform} />
      ))}
    </div>
  )
}
