import clsx from 'clsx'
import { useRef } from 'react'
import { useAsync, useAsyncFn } from 'react-use'
import { detectNeedsLogin, getAuthorizeUrl, getTokenStorageKey } from '../../../core'
import { BaseButton } from '../primitives/base-button'

interface CloudServiceLoginButtonProps {
  cloudService: 'onedrive' | 'google-drive'
  onLogin: () => void
}

export function CloudServiceLoginButton({ cloudService, onLogin }: CloudServiceLoginButtonProps) {
  const authorizeUrlState = useAsync(async () => await getAuthorizeUrl(cloudService))
  const authorizeWindow = useRef<Window | null>(null)

  const [state, checkLoginStatus] = useAsyncFn(async () => {
    await new Promise<void>((resolve, reject) => {
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
    if (!event.target.href) {
      return
    }
    authorizeWindow.current = open(event.target.href)
    const isLogin = await checkLoginStatus()
    if (isLogin) {
      onLogin()
    }
  }

  if (state.loading || state.value) {
    return (
      <div className='flex h-12 items-center justify-center'>
        <span className='icon-[line-md--loading-loop] h-12 w-12 text-red-600' />
      </div>
    )
  }

  return (
    <div className='flex h-12 items-center justify-center'>
      <BaseButton className='m-auto !px-0 !py-0' onClick={login} styleType='primary'>
        {authorizeUrlState.value ? (
          <a
            className='flex items-center justify-center self-stretch px-4 py-2'
            href={authorizeUrlState.value}
            onClick={(e) => e.preventDefault()}
            rel='noreferrer'
            target='_blank'
          >
            <span
              className={clsx('mr-2 inline-block h-5 w-5', {
                'icon-[logos--microsoft-icon]': cloudService === 'onedrive',
                'icon-[logos--google-icon]': cloudService === 'google-drive',
              })}
            />
            Login
          </a>
        ) : null}
      </BaseButton>
    </div>
  )
}
