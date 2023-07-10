import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useAsync, useAsyncFn } from 'react-use'
import { detectNeedsLogin, getAuthorizeUrl, getTokenStorageKey } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { emitter } from '../../lib/emitter'
import { ReturnToHomeButton } from './return-to-home-button'

interface CloudServiceLoginButtonProps {
  cloudService: 'onedrive' | 'google-drive'
  onLogin: () => void
}

const cloudServiceMap = {
  onedrive: 'Microsoft',
  'google-drive': 'Google',
}

export function CloudServiceLoginButton({ cloudService, onLogin }: CloudServiceLoginButtonProps) {
  const authorizeUrlState = useAsync(async () => await getAuthorizeUrl(cloudService))
  const authorizeWindow = useRef<Window | null>(null)
  const [isAuthWindowOpening, setIsAuthWindowOpening] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAuthWindowOpening(!authorizeWindow.current?.closed)
    }, 500)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const [state, checkLoginStatus] = useAsyncFn(async () => {
    await new Promise<void>((resolve) => {
      function onStorage(event: StorageEvent) {
        if (event.key === getTokenStorageKey(cloudService)) {
          // authorizeWindow.current?.close()
          removeEventListener('storage', onStorage)
          resolve()
        }
      }
      addEventListener('storage', onStorage)
    })
    const needsLogin = await detectNeedsLogin(cloudService)
    if (!needsLogin) {
      return true
    }
    throw new Error('Login failed')
  })

  async function login(event) {
    event.preventDefault()
    if (!event.currentTarget.href) {
      return
    }
    authorizeWindow.current = open(event.currentTarget.href, '_blank', 'popup')
    const isLogin = await checkLoginStatus()
    if (isLogin) {
      onLogin()
    }
  }

  if ((state.loading || state.value) && isAuthWindowOpening) {
    return (
      <div className='flex h-12 items-center justify-center'>
        <span className='icon-[line-md--loading-loop] h-12 w-12 text-rose-700' />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-stretch justify-center gap-y-4 px-20'>
      <BaseButton
        href={authorizeUrlState.value}
        onClick={login}
        rel='noreferrer'
        styleType='primary'
        tabIndex={0}
        tag='a'
        target='_blank'
      >
        <span
          className={clsx('mr-2 inline-block h-5 w-5', {
            'icon-[logos--microsoft-icon]': cloudService === 'onedrive',
            'icon-[logos--google-icon]': cloudService === 'google-drive',
          })}
        />
        Sign in with {cloudServiceMap[cloudService]}
      </BaseButton>
      <ReturnToHomeButton></ReturnToHomeButton>
    </div>
  )
}
