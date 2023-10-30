import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'
import { getProvider, isUsingDemo, start } from '../../../core'
import { HomeScreen } from '../home-screen'
import { useRouterHelpers } from '../home-screen/hooks'
import { Intro } from '../intro'
import { RomScreen } from '../rom-screen'

export function System() {
  const { params, navigateToSystem, navigateToHome } = useRouterHelpers()

  const [state, { execute }] = useAsync(async () => {
    const provider = getProvider()
    if (provider === params.library) {
      await start()
    } else if (isUsingDemo()) {
      navigateToHome()
    } else {
      navigateToSystem(undefined, provider)
    }
  })

  useEffect(() => {
    execute()
  }, [execute, params.library])

  if (state.status === 'success') {
    return (
      <>
        <HomeScreen />
        <Intro />
        {params.rom ? <RomScreen /> : null}
      </>
    )
  }
}
