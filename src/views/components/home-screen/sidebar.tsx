import { useAtom } from 'jotai'
import { isSettingsModalOpenAtom } from '../../lib/atoms'

export function Sidebar() {
  const [, setShowSettings] = useAtom(isSettingsModalOpenAtom)

  function openSettings() {
    setShowSettings(true)
  }

  return (
    <>
      <div className='pt-10 text-center text-xl'>Retro Assembly</div>
      <div className='flex-1'></div>
      <button className='mb-10' onClick={openSettings}>
        Settings
      </button>
    </>
  )
}
