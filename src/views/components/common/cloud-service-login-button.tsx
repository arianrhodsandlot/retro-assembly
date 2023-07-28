import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useAsync, useAsyncFn } from 'react-use'
import { detectNeedsLogin, getAuthorizeUrl, getTokenStorageKey } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { ReturnToHomeButton } from './return-to-home-button'

const cloudServiceMap = {
  onedrive: 'Microsoft',
  'google-drive': 'Google',
  dropbox: 'Dropbox',
}

interface CloudServiceLoginButtonProps {
  cloudService: 'onedrive' | 'google-drive' | 'dropbox'
  showReturnHome?: boolean
  onLogin: () => void
}

export function CloudServiceLoginButton({
  cloudService,
  showReturnHome = false,
  onLogin,
}: CloudServiceLoginButtonProps) {
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

    const width = 600
    const height = 700
    const top = outerHeight / 2 + screenY - height / 2
    const left = outerWidth / 2 + screenX - width / 2
    const features = `popup,width=${width},height=${height},top=${top},left=${left}`
    authorizeWindow.current = open(event.currentTarget.href, '_blank', features)

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
    <div className='flex flex-col items-stretch justify-center gap-y-4 px-10'>
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
            'icon-[logos--dropbox]': cloudService === 'dropbox',
          })}
        />
        Sign in with {cloudServiceMap[cloudService]}
      </BaseButton>
      {showReturnHome ? <ReturnToHomeButton /> : null}
    </div>
  )
}
