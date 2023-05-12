import '../styles/index.sass'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { system } from '../../core'
import { isSettingsModalOpenAtom, needsGrantLocalPermissionAtom, needsSetupAtom } from '../lib/atoms'
import HomeScreen from './home-screen'
import LocalPermission from './modals/local-permission'
import { Settings } from './modals/settings'
import SetupWizard from './modals/setup-wizard'

export default function App() {
  const [, setNeedsSetup] = useAtom(needsSetupAtom)
  const [, setShowSettings] = useAtom(isSettingsModalOpenAtom)
  const [, setNeedsGrantLocalPermissionAtom] = useAtom(needsGrantLocalPermissionAtom)

  function openSettings() {
    setShowSettings(true)
  }

  async function checkPreparations() {
    const needsSetup = await system.checkNeedsSetup()
    setNeedsSetup(needsSetup)

    if (!needsSetup) {
      const needsGrantPermission = await system.needsGrantPermissionManually()
      setNeedsGrantLocalPermissionAtom(needsGrantPermission)
      if (!needsGrantPermission) {
        await system.start()
      }
    }
  }

  useEffect(() => {
    checkPreparations()
  }, [])

  return (
    <div className='min-h-screen'>
      <div className='absolute flex h-screen w-[200px] flex-col bg-[#fe0000] text-white'>
        <div className='pt-10 text-center text-xl'>Retro Assembly</div>
        <div className='flex-1'></div>
        <button className='mb-10' onClick={openSettings}>
          Settings
        </button>
      </div>

      <div className='h-screen w-full overflow-x-hidden pl-[200px]'>
        <HomeScreen />
      </div>

      <SetupWizard onSubmit={checkPreparations} />
      <LocalPermission onSubmit={checkPreparations} />
      <Settings />
    </div>
  )
}
