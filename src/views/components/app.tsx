import '../styles/index.sass'
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { system, ui } from '../../core'
import { needsGrantLocalPermissionAtom, needsSetupAtom } from '../lib/atoms'
import EmulatorWrapper from './emulator/emulator-wrapper'
import { HomeScreen } from './home-screen'
import LocalPermission from './modals/local-permission'
import { Settings } from './modals/settings'
import SetupWizard from './modals/setup-wizard'

export default function App() {
  const [, setNeedsSetup] = useAtom(needsSetupAtom)
  const [, setNeedsGrantLocalPermissionAtom] = useAtom(needsGrantLocalPermissionAtom)
  const { navigateByDirection } = useFocusable()

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

    system.onRequestAuthError(() => {
      setNeedsSetup(true)
    })

    ui.onPressButton('left', () => {
      navigateByDirection('left', {})
    })
    ui.onPressButton('right', () => {
      navigateByDirection('right', {})
    })
    ui.onPressButton('up', () => {
      navigateByDirection('up', {})
    })
    ui.onPressButton('down', () => {
      navigateByDirection('down', {})
    })
  }, [])

  return (
    <>
      <HomeScreen />
      <EmulatorWrapper />
      <SetupWizard onSubmit={checkPreparations} />
      <LocalPermission onSubmit={checkPreparations} />
      <Settings />
    </>
  )
}
