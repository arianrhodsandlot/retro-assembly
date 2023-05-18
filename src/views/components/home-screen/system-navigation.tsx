import classNames from 'classnames'
import { type Ref } from 'react'
import atari2600 from '../../assets/consoles/Atari - 2600.png'
import atari5200 from '../../assets/consoles/Atari - 5200.png'
import atari7800 from '../../assets/consoles/Atari - 7800.png'
import atarilynx from '../../assets/consoles/Atari - lynx.png'
import gw from '../../assets/consoles/Handheld Electronic Game.png'
import gba from '../../assets/consoles/Nintendo - Game Boy Advance.png'
import gbc from '../../assets/consoles/Nintendo - Game Boy Color.png'
import gb from '../../assets/consoles/Nintendo - Game Boy.png'
import n64 from '../../assets/consoles/Nintendo - Nintendo 64.png'
import nes from '../../assets/consoles/Nintendo - Nintendo Entertainment System.png'
import snes from '../../assets/consoles/Nintendo - Super Nintendo Entertainment System.png'
import vb from '../../assets/consoles/Nintendo - Virtual Boy.png'
import _32x from '../../assets/consoles/Sega - 32X.png'
import gamegear from '../../assets/consoles/Sega - Game Gear.png'
import sms from '../../assets/consoles/Sega - Master System - Mark III.png'
import megadrive from '../../assets/consoles/Sega - Mega Drive - Genesis.png'
import psx from '../../assets/consoles/Sony - PlayStation.png'

const systemImageMap = {
  atari2600,
  atari5200,
  atari7800,
  atarilynx,
  gw,
  gba,
  gbc,
  gb,
  n64,
  nes,
  snes,
  vb,
  '32x': _32x,
  gamegear,
  sms,
  megadrive,
  psx,
}

export function SystemNavigation({
  currentSystem,
  systems,
  onChange,
  elementRef,
}: {
  currentSystem: string
  systems: any[]
  onChange: (systemName: string) => void
  elementRef: Ref<HTMLDivElement>
}) {
  return (
    <div className='relative z-[1] w-full overflow-auto bg-[#fe0000] text-white' ref={elementRef}>
      <div className='flex flex-nowrap'>
        {systems.map((system) => {
          const isCurrent = system.name === currentSystem
          return (
            <div
              role='button'
              className={classNames(
                'flex shrink-0 items-center justify-center border-[#fe0000] px-8 py-4 transition-[opacity,background-color] hover:opacity-100',
                {
                  'opacity-80': !isCurrent,
                  'bg-[#ac000d]': isCurrent,
                }
              )}
              key={system.name}
              aria-hidden
              onClick={() => onChange(system.name)}
            >
              <img src={systemImageMap[system.name]} alt='' width={50} height={50} />
              {isCurrent && <div className='ml-2'>{system.fullName}</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
