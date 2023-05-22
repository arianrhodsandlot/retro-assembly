import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import logo from '../../assets/logo.png'
import { isSettingsModalOpenAtom } from '../../lib/atoms'

function Setting({ onClick }: { onClick: () => void }) {
  useEffect(() => {}, [])

  return (
    <button className={classNames('mx-auto mb-10')} onClick={onClick}>
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
    <>
      <div className='absolute z-[1] flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
        <div className='pt-10 text-center text-xl'>
          <img
            src={logo}
            className='m-auto h-24 w-24 rounded-full border-4 border-solid border-white bg-[#ddd] object-contain shadow-[0_0_6px_rgba(0,0,0,0.6)]'
            alt='logo'
          />
        </div>
        <div className='flex-1'></div>
        <Setting onClick={openSettings} />
      </div>
    </>
  )
}
