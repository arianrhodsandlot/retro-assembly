import { useLocation, useParams } from 'wouter'
import { detectNeedsSetup, start } from '../../../core'
import { HomeScreen } from '../home-screen'
import { useAsyncExecute } from '../hooks'
import { RomScreen } from '../rom-screen'

export function System() {
  const [, setLocation] = useLocation()
  const params = useParams()

  const [state] = useAsyncExecute(async () => {
    const needsSetup = await detectNeedsSetup()
    if (needsSetup) {
      setLocation('/', { replace: true })
      throw new Error('needs setup')
    }
    await start()
  })

  if (state.status === 'success') {
    return (
      <>
        <HomeScreen />
        {params.rom ? <RomScreen /> : null}
      </>
    )
  }
}
