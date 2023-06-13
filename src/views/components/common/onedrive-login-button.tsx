import { useRef } from 'react'
import { useAsyncFn } from 'react-use'
import { OneDriveProvider, system } from '../../../core'
import { BaseButton } from '../primitives/base-button'

const authorizeUrl = system.getOnedriveAuthorizeUrl()

export function OnedriveLoginButton({ onLogin }: { onLogin: () => void }) {
  const authorizeWindow = useRef<Window | null>(null)

  const [state, checkLoginStatus] = useAsyncFn(async () => {
    await new Promise<void>((resolve, reject) => {
      function onStorage(event: StorageEvent) {
        if (event.key === OneDriveProvider.tokenStorageKey) {
          authorizeWindow.current?.close()
          removeEventListener('storage', onStorage)
          resolve()
        }
      }
      addEventListener('storage', onStorage)
    })
    const needsOnedriveLogin = await system.needsOnedriveLogin()
    if (!needsOnedriveLogin) {
      return true
    }
    throw new Error('Login failed')
  })

  async function login(event) {
    event.preventDefault()
    authorizeWindow.current = open(authorizeUrl)
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
          <span className='icon-[logos--microsoft-icon] mr-2 inline-block h-5 w-5' />
          Login
        </a>
      </BaseButton>
    </div>
  )
}
