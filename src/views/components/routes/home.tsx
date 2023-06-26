import { useEffect, useState } from 'react'
import { useAsyncRetry } from 'react-use'
import { detectNeedsSetup, start, teardown } from '../../../core'
import { emitter } from '../../lib/emitter'
import { HomeScreen } from '../home-screen'
import SetupWizard from '../setup-wizard'

export function Home() {
  const [isStarted, setIsStarted] = useState(false)

  const preparationState = useAsyncRetry(async () => {
    const needsSetup = await detectNeedsSetup()
    if (needsSetup === false) {
      await start()
      setIsStarted(true)
    }
    return needsSetup
  })

  useEffect(() => {
    async function reload() {
      setIsStarted(false)
      await teardown()
      preparationState.retry()
    }

    emitter.on('reload', reload)
    return () => {
      emitter.off('reload', reload)
    }
  }, [preparationState])

  return (
    <>
      {isStarted ? <HomeScreen /> : false}
      {preparationState.value ? <SetupWizard onSetup={() => preparationState.retry()} /> : false}
    </>
  )
}
