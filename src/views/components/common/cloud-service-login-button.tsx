import clsx from 'clsx'
import { useRef } from 'react'
import { useAsyncFn } from 'react-use'
import { system } from '../../../core'
import { BaseButton } from '../primitives/base-button'

export function CloudServiceLoginButton({
  cloudService,
  onLogin,
}: {
  cloudService: 'onedrive' | 'google-drive'
  onLogin: () => void
}) {
  const authorizeUrl = system.getAuthorizeUrl(cloudService)
  const authorizeWindow = useRef<Window | null>(null)

  const [state, checkLoginStatus] = useAsyncFn(async () => {
    await new Promise<void>((resolve, reject) => {
      function onStorage(event: StorageEvent) {
        if (event.key === system.getTokenStorageKey(cloudService)) {
          authorizeWindow.current?.close()
          removeEventListener('storage', onStorage)
          resolve()
        }
      }
      addEventListener('storage', onStorage)
    })
    const needsOnedriveLogin = await system.needsLogin(cloudService)
    if (!needsOnedriveLogin) {
      return true
    }
    throw new Error('Login failed')
  })

  async function login(event) {
    event.preventDefault()
    authorizeWindow.current = system.authorize(cloudService)
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
        <a
          className='flex items-center justify-center self-stretch px-4 py-2'
          href={authorizeUrl}
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
      </BaseButton>
    </div>
  )
}
