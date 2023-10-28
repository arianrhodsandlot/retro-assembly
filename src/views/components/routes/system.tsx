import { useLocation, useParams } from 'wouter'
import { detectNeedsSetup, isUsingDemo, start } from '../../../core'
import { HomeScreen } from '../home-screen'
import { useAsyncExecute } from '../hooks'
import { Intro } from '../intro'
import { RomScreen } from '../rom-screen'

export function System() {
  const [, setLocation] = useLocation()
  const params = useParams()
  const usingDemo = isUsingDemo()

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
        {usingDemo ? <Intro /> : null}
        {params.rom ? <RomScreen /> : null}
      </>
    )
  }
}
