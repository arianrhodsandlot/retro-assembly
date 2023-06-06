import { useStore } from 'jotai'
import { useCallback, useEffect } from 'react'
import { system } from '../../../core'
import { needsFreshSetupAtom, needsRegrantLocalPermissionAtom, needsValidateSystemConfigAtom } from '../../lib/atoms'
import { Emulator } from '../emulator'
import { HomeScreen } from '../home-screen'
import SetupWizard from '../setup-wizard'

export function Home() {
  const store = useStore()

  const checkPreparations = useCallback(async () => {
    let shouldStart = false

    const needsSetup = await system.checkNeedsSetup()
    store.set(needsFreshSetupAtom, needsSetup)

    if (!needsSetup) {
      const needsRegrantLocalPermission = await system.needsRegrantLocalPermission()
      store.set(needsRegrantLocalPermissionAtom, needsRegrantLocalPermission)
      if (!needsRegrantLocalPermission) {
        shouldStart = true
      }
    }

    store.set(needsValidateSystemConfigAtom, false)

    if (shouldStart) {
      system.start()
    }
  }, [store])

  useEffect(() => {
    const unsub = store.sub(needsValidateSystemConfigAtom, async () => {
      if (store.get(needsValidateSystemConfigAtom)) {
        await checkPreparations()
      }
    })

    checkPreparations()

    system.onRequestAuthError(() => {
      store.set(needsFreshSetupAtom, true)
    })

    function destruct() {
      unsub()
    }

    return destruct
  }, [checkPreparations, store])

  return (
    <>
      <HomeScreen />
      <Emulator />
      <SetupWizard />
    </>
  )
}
