import type { ReactNode } from 'react'
import { platformFullNameMap } from '@/constants/platform'
import { SidebarLink } from './components/sidebar-link'

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

const platformIconMap = {
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
  text: platformFullNameMap[platform],
}))

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className='flex h-screen'>
      <aside className='bg-[var(--theme)] text-white flex flex-col w-56'>
        <div className='py-4 text-center font-bold'>Retroassembly</div>

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
      </aside>

      <div className='flex-1 p-4 bg-zinc-100 h-full overflow-auto'>{children}</div>
    </div>
  )
}
