import { useEffect } from 'react'
import { useAsync } from 'react-use'
import { type CloudService, retrieveToken } from '../../../../core'
import { BouncingEllipsis } from '../../common/bouncing-ellipsis'
import { AuthLayout } from './auth-layout'

interface AuthMainProps {
  cloudService: CloudService
}

export function AuthMain({ cloudService }: AuthMainProps) {
  const state = useAsync(async () => await retrieveToken(cloudService))

  useEffect(() => {
    if (!state.loading && !state.error) {
      close()
    }
  }, [state.loading, state.error])

  if (state.loading) {
    return (
      <AuthLayout>
        <div className='flex flex-col text-rose-700'>
          <span className='icon-[line-md--loading-loop] h-16 w-16' />
          <div className='mt-10 flex'>
            Loading <BouncingEllipsis />
          </div>
        </div>
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
