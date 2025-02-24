'use client'
import { useActionState } from 'react'
import { getLoginUrl } from '@/controllers/get-login-url.ts'

export function LoginForm({ redirectTo }) {
  const [, formAction, isLoading] = useActionState<undefined, FormData>(async (state: undefined, payload: FormData) => {
    const loginUrl = await getLoginUrl(payload)
    if (loginUrl) {
      location.assign(loginUrl)
    }
  }, undefined)

  return (
    <form action={formAction} className='w-5xl mx-auto mt-20 text-center'>
      <div className='mt-10'>
        <input name='redirect_to' type='hidden' value={redirectTo} />
        <button className='underline' disabled={isLoading} type='submit'>
          {isLoading ? 'Loading...' : 'Login with Google'}
        </button>
      </div>
    </form>
  )
}
