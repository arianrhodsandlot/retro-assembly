import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'
import { getProvider, isUsingDemo, start } from '../../../../../core'
import { useRouterHelpers } from '../../../hooks/use-router-helpers'
import { HomeScreen } from './home-screen'

export function LibraryPlatform() {
  const { params, navigateToPlatform: navigateToSystem, navigateToHome } = useRouterHelpers()

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
    return <HomeScreen />
  }
}
