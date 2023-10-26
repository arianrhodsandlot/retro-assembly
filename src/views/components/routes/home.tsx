import { useAsyncRetry } from 'react-use'
import { useLocation } from 'wouter'
import { detectNeedsSetup, start } from '../../../core'
import SetupWizard from '../setup-wizard'

export function Home() {
  const [, setLocation] = useLocation()

  const preparationState = useAsyncRetry(async () => {
    const needsSetup = await detectNeedsSetup()
    if (needsSetup === false) {
      await start()
      setLocation('/system/recent-system', { replace: true })
    }
    return needsSetup
  })

  if (preparationState.value) {
    return <SetupWizard onSetup={() => preparationState.retry()} />
  }
}
