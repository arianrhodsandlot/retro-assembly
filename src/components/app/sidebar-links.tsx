import { platformMap } from '@/constants/platform.ts'
import { getPlatformIcon } from '@/utils/rom.ts'
import { SidebarLink } from './sidebar-link.tsx'

const defaultPlatformNames = ['gba', 'gbc', 'gb', 'nes', 'snes', 'megadrive', 'atari2600', 'arcade']

const links = [
  {
    href: '/app',
    icon: <span className='icon-[mdi--bookshelf] size-5' />,
    text: 'Library',
  },
]

const platformLinks = defaultPlatformNames.map((platform) => ({
  href: `/app/platform/${encodeURIComponent(platform)}`,
  icon: getPlatformIcon(platform, ''),
  name: platform,
  text: platformMap[platform].displayName,
}))

export function SidebarLinks({ platform }: { platform?: string }) {
  return (
    <>
      <div className='flex flex-col'>
        {links.map(({ href, icon, text }) => (
          <SidebarLink active={!platform} href={href} key={text}>
            <div className='flex size-5 items-center justify-center'>{icon}</div>
            {text}
          </SidebarLink>
        ))}
      </div>

      <div className='mt-4'>
        <h3 className='px-4 text-white/60'>Platforms</h3>

        <div className='mt-2 flex flex-col gap-y-1'>
          {platformLinks.map(({ href, icon, name, text }) => (
            <SidebarLink active={platform === name} href={href} key={text}>
              {icon ? <img alt='icon' height='20' src={icon} width='20' /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
