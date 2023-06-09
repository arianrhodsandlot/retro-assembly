import { useEffect } from 'react'
import { useAsync } from 'react-use'
import { system } from '../../../../core'
import { AuthLayout } from './auth-layout'

export function AuthOnedrive() {
  const state = useAsync(() => system.retrieveToken())

  useEffect(() => {
    if (!state.loading && !state.error) {
      close()
    }
  }, [state.loading, state.error])

  if (state.loading) {
    return (
      <AuthLayout>
        <span className='icon-[line-md--loading-loop] h-6 w-6' />
      </AuthLayout>
    )
  }

  if (state.error) {
    return (
      <AuthLayout>
        <span className='icon-[mdi--account-alert] h-6 w-6' />
        Login fail. Error: {state.error.message}
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <span className='icon-[mdi--account-check] h-6 w-6' />
      You are now authenticated with Retro Assembly.
    </AuthLayout>
  )
}
