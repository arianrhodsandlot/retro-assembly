import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'
import { useLocation } from 'wouter'
import { detectNeedsSetup, start } from '../../../core'
import { HomeScreen } from '../home-screen'

export function System() {
  const [, setLocation] = useLocation()
  const [state, { execute }] = useAsync(async () => {
    const needsSetup = await detectNeedsSetup()
    if (needsSetup) {
      setLocation('/', { replace: true })
      throw new Error('needs setup')
    }
    await start()
  })

  useEffect(() => {
    execute()
  }, [execute])

  if (state.status === 'success') {
    return <HomeScreen />
  }
}
