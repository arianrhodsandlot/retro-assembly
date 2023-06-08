import { useEffect, useState } from 'react'
import { useAsyncRetry } from 'react-use'
import { system } from '../../../core'
import { emitter } from '../../lib/emitter'
import { HomeScreen } from '../home-screen'
import SetupWizard from '../setup-wizard'

export function Home() {
  const [isStarted, setIsStarted] = useState(false)

  const preparationState = useAsyncRetry(async () => {
    const needsSetup = await system.checkNeedsSetup()
    if (needsSetup === false) {
      await system.start()
      setIsStarted(true)
    }
    return needsSetup
  })

  useEffect(() => {
    async function reload() {
      setIsStarted(false)
      await system.teardown()
      preparationState.retry()
    }

    emitter.on('reload', reload)
    return () => {
      emitter.off('reload', reload)
    }
  }, [preparationState])

  return (
    <div className='relative h-screen w-screen'>
      {isStarted ? <HomeScreen /> : false}
      {preparationState.value ? <SetupWizard onSetup={() => preparationState.retry()} /> : false}
    </div>
  )
}
