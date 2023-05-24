import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { clsx } from 'clsx'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import logo from '../../assets/logo.png'
import { isSettingsModalOpenAtom } from '../../lib/atoms'

function Setting({ onClick }: { onClick: () => void }) {
  return (
    <button
      className={clsx(
        'relative mx-auto mb-10 rounded-md p-2 transition-[color,background-color]',
        'focus:text-[#fe0000]',
        'focus:after:absolute focus:after:inset-0 focus:after:-z-10 focus:after:rounded-md focus:after:bg-white'
      )}
      onClick={onClick}
    >
      <Cog6ToothIcon className='h-20 w-20' />
    </button>
  )
}

export function Sidebar() {
  const [, setShowSettings] = useAtom(isSettingsModalOpenAtom)

  function openSettings() {
    setShowSettings(true)
  }

  return (
    <div className='absolute z-[1] flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
      <div className='pt-10 text-center text-xl'>
        <img
          alt='logo'
          className='m-auto h-24 w-24 rounded-full border-4 border-solid border-white bg-[#ddd] object-contain shadow-[0_0_6px_rgba(0,0,0,0.6)]'
          src={logo}
        />
      </div>
      <div className='flex-1' />
      <Setting onClick={openSettings} />
    </div>
  )
}
