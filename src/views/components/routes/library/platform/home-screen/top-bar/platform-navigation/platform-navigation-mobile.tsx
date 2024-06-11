import { useRef } from 'react'
import { platformImageMap } from '../../../../../../../lib/constants'
import { useRouterHelpers } from '../../../../../../hooks/use-router-helpers'
import { getPlatformDisplayName } from './utils'

interface PlatformNavigationMobileProps {
  platforms: { name: string; fullName: string }[]
  current?: { name: string; fullName: string }
}

export function PlatformNavigationMobile({ platforms, current }: PlatformNavigationMobileProps) {
  const selectRef = useRef<HTMLSelectElement>(null)
  const { navigateToPlatform } = useRouterHelpers()

  if (!current) {
    return
  }

  const dropdownEnabled = platforms.length > 1

  return (
    <div className='platform-navigation-mobile flex-center relative flex-1 overflow-hidden sm:hidden'>
      <button className='flex-center w-full'>
        <img
          alt={current.fullName}
          className='shrink-0 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.3)]'
          height={28}
          src={platformImageMap[current.name]}
          width={28}
        />
        <div className='ml-2 truncate'>{current ? getPlatformDisplayName(current.fullName) : ''}</div>
        {dropdownEnabled ? <span className='icon-[mdi--menu-down] size-8 shrink-0' /> : null}
      </button>

      {dropdownEnabled ? (
        <select
          className='absolute inset-0 appearance-none bg-transparent opacity-0'
          onChange={({ target: { value: platform } }) => navigateToPlatform(platform)}
          ref={selectRef}
          value={current?.name}
        >
          {platforms.map((platform) => (
            <option key={platform.name} value={platform.name}>
              {getPlatformDisplayName(platform.fullName)}
            </option>
          ))}
        </select>
      ) : null}
    </div>
  )
}
