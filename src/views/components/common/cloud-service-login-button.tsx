import clsx from 'clsx'
import mitt from 'mitt'
import { useRef, useState } from 'react'
import { useAsync, useAsyncFn, useInterval } from 'react-use'
import { type CloudService, detectNeedsLogin, getAuthorizeUrl, getTokenStorageKey } from '../../../core'
import { BaseButton } from '../primitives/base-button'
import { ReturnToHomeButton } from './return-to-home-button'

const cloudServiceMap = {
  onedrive: 'Microsoft',
  'google-drive': 'Google',
  dropbox: 'Dropbox',
}

function openAuthWindow(url) {
  const width = 700
  const height = 700
  const top = outerHeight / 2 + screenY - height / 2
  const left = outerWidth / 2 + screenX - width / 2
  const features = `popup,width=${width},height=${height},top=${top},left=${left}`
  return open(url, '_blank', features)
}

interface CloudServiceLoginButtonProps {
  cloudService: CloudService
  showReturnHome?: boolean
  onLogin: () => void
}

const emitter = mitt()
export function CloudServiceLoginButton({
  cloudService,
  showReturnHome = false,
  onLogin,
}: CloudServiceLoginButtonProps) {
  const authorizeUrlState = useAsync(async () => await getAuthorizeUrl(cloudService))
  const authorizeWindow = useRef<Window | null>(null)
  const [isAuthWindowOpening, setIsAuthWindowOpening] = useState(false)

  useInterval(() => {
    const newIsAuthWindowOpening = authorizeWindow.current ? !authorizeWindow.current?.closed : false
    setIsAuthWindowOpening(newIsAuthWindowOpening)
    if (isAuthWindowOpening && !newIsAuthWindowOpening) {
      emitter.emit('auth-window-closed')
    }
  }, 100)

  const [needsLoginState, checkNeedsLogin] = useAsyncFn(async () => {
    const promise = new Promise<boolean>((resolve) => {
      async function onStorage(event: StorageEvent) {
        if (event.key === getTokenStorageKey(cloudService)) {
          cleanup()
          const needsLogin = await detectNeedsLogin(cloudService)
          resolve(needsLogin)
        }
      }

      function onAuthWindowClosed() {
        cleanup()
        resolve(true)
      }

      function cleanup() {
        removeEventListener('storage', onStorage)
        emitter.off('auth-window-closed', onAuthWindowClosed)
      }

      addEventListener('storage', onStorage)
      emitter.on('auth-window-closed', onAuthWindowClosed)
    })
    return await promise
  })

  async function login(event) {
    event.preventDefault()
    const authUrl = event.currentTarget.href
    if (authUrl) {
      authorizeWindow.current = openAuthWindow(authUrl)
      const needsLogin = await checkNeedsLogin()
      if (needsLogin === false) {
        onLogin()
      }
    }
  }

  const loginPending = needsLoginState.loading || isAuthWindowOpening
  const loginSuccess = !needsLoginState.loading && needsLoginState.value === false
  const showLoading = loginPending || loginSuccess

  if (showLoading) {
    return (
      <div className='flex h-12 items-center justify-center'>
        <span className='icon-[line-md--loading-loop] h-12 w-12 text-rose-700' />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-stretch justify-center gap-y-4 px-10'>
      <BaseButton
        data-testid='authorize-link'
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
