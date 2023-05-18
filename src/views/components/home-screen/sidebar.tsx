import { Cog6ToothIcon } from '@heroicons/react/24/outline'
import { useAtom } from 'jotai'
import logo from '../../assets/logo.png'
import { isSettingsModalOpenAtom } from '../../lib/atoms'

export function Sidebar() {
  const [, setShowSettings] = useAtom(isSettingsModalOpenAtom)

  function openSettings() {
    setShowSettings(true)
  }

  return (
    <>
      <div className='pt-10 text-center text-xl'>
        <img
          src={logo}
          className='m-auto h-24 w-24 rounded-full border-4 border-solid border-white bg-[#ddd] object-contain shadow-[0_0_6px_rgba(0,0,0,0.6)]'
          alt='logo'
        />
      </div>
      <div className='flex-1'></div>
      <button className='mx-auto mb-10' onClick={openSettings}>
        <Cog6ToothIcon className='h-20 w-20' />
      </button>
    </>
  )
}
