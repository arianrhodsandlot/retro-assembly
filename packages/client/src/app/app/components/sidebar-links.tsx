import { platformMap } from '@/constants/platform'
import { SidebarLink } from './sidebar-link'

const defaultPlatformNames = ['gba', 'nes', 'snes', 'megadrive', 'atari2600', 'arcade']

const links = [
  {
    href: '/app',
    icon: <span className='size-5 icon-[mdi--bookshelf]' />,
    text: 'All',
  },
  {
    href: { pathname: '/app', query: { sort: 'added' } },
    icon: <span className='size-5 icon-[mdi--recent]' />,
    text: 'Recently added',
  },
  {
    href: { pathname: '/app', query: { sort: 'played' } },
    icon: <span className='size-5 icon-[mdi--controller-square]' />,
    text: 'Recently played',
  },
]

const platformIconMap: Record<string, string> = {
  arcade: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/arcade%40132w.png',
  atari2600: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/atari%40132w.png',
  gba: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/gba%40132w.png',
  megadrive: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/md%40132w.png',
  nes: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/fc%40132w.png',
  snes: 'https://cdn.jsdelivr.net/gh/KyleBing/retro-game-console-icons@main/132w%401x/sfc%40132w.png',
}

const platformLinks = defaultPlatformNames.map((platform) => ({
  href: { pathname: '/app', query: { platform } },
  icon: platformIconMap[platform],
  text: platformMap[platform].displayName,
}))

export function SidebarLinks() {
  return (
    <>
      <div className='flex flex-col'>
        {links.map(({ href, icon, text }) => (
          <SidebarLink href={href} key={text}>
            <div className='size-6 items-center justify-center flex'>{icon}</div>
            {text}
          </SidebarLink>
        ))}
      </div>

      <div className='mt-10'>
        <h3 className='text-white/60 px-4'>Platforms</h3>

        <div className='flex flex-col'>
          {platformLinks.map(({ href, icon, text }) => (
            <SidebarLink href={href} key={text}>
              {icon ? <img alt='icon' className='relative top-0.5' height='24' src={icon} width='24' /> : null}
              {text}
            </SidebarLink>
          ))}
        </div>
      </div>
    </>
  )
}
