import { useAsync } from '@react-hookz/web'
import { useEffect, useState } from 'react'
import { getProvider, isUsingDemo, start } from '../../../../core'
import { useRouterHelpers } from '../../hooks/use-router-helpers'
import { Intro } from '../home/intro'
import { HomeScreen } from '../library/platform/home-screen'
import { GameAddons } from '../library/rom/game-addons'

export function UniversalHomeRoute() {
  const { params, isHomeRoute, isPlatformRoute, isRomRoute, navigateToLibrary, navigateToPlatform, navigateToHome } =
    useRouterHelpers()
  const [started, setStarted] = useState(false)

  const [, { execute }] = useAsync(async () => {
    const provider = getProvider()
    if (isHomeRoute) {
      if (provider === 'public') {
        await start('public')
        setStarted(true)
      } else {
        navigateToLibrary(provider)
      }
    } else if (provider === params.library) {
      await start()
      setStarted(true)
    } else if (isUsingDemo()) {
      navigateToHome()
    } else {
      navigateToPlatform(undefined, provider)
    }
  })

  useEffect(() => {
    execute()
  }, [execute, isHomeRoute, params.library])

  if (started === false) {
    return
  }

  if (isHomeRoute) {
    return (
      <>
        <HomeScreen />
        <Intro />
      </>
    )
  }

  if (isPlatformRoute) {
    return <HomeScreen />
  }

  if (isRomRoute) {
    return (
      <>
        <HomeScreen />
        <GameAddons />
      </>
    )
  }
}
