import { useAsyncFn, useAsyncRetry } from 'react-use'
import { system } from '../../../core'
import { HomeScreen } from '../home-screen'
import SetupWizard from '../setup-wizard'

export function Home() {
  const [startState, start] = useAsyncFn(async () => {
    await system.start()
    return true
  })

  const preparationState = useAsyncRetry(async () => {
    const needsSetup = await system.checkNeedsSetup()

    if (needsSetup === false) {
      start()
    }

    return needsSetup
  })

  return (
    <div className='relative h-screen w-screen'>
      {startState.value ? <HomeScreen /> : false}
      {preparationState.value ? <SetupWizard onSetup={() => preparationState.retry()} /> : false}
    </div>
  )
}
