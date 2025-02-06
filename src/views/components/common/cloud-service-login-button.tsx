import { useAsync as useAsyncFn, useIntervalEffect } from '@react-hookz/web'
import { clsx } from 'clsx'
import mitt from 'mitt'
import { type MouseEvent, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { type CloudService, detectNeedsLogin, getAuthorizeUrl, getTokenStorageKey } from '../../../core'
import { useAsyncExecute } from '../hooks/use-async-execute'
import { BaseButton } from '../primitives/base-button'
import { ReturnToHomeButton } from './return-to-home-button'

const cloudServiceMap = {
  dropbox: 'Dropbox',
  'google-drive': 'Google',
  onedrive: 'Microsoft',
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
  onLogin: () => void
  showReturnHome?: boolean
}

const emitter = mitt()
export function CloudServiceLoginButton({
  cloudService,
  onLogin,
  showReturnHome = false,
}: CloudServiceLoginButtonProps) {
  const { t } = useTranslation()
  const [authorizeUrlState] = useAsyncExecute(async () => await getAuthorizeUrl(cloudService))
  const authorizeWindow = useRef<null | Window>(null)
  const [isAuthWindowOpening, setIsAuthWindowOpening] = useState(false)

  useIntervalEffect(() => {
    const newIsAuthWindowOpening = authorizeWindow.current ? !authorizeWindow.current?.closed : false
    setIsAuthWindowOpening(newIsAuthWindowOpening)
    if (isAuthWindowOpening && !newIsAuthWindowOpening) {
      emitter.emit('auth-window-closed')
    }
  }, 100)

  const [needsLoginState, { execute: checkNeedsLogin }] = useAsyncFn(async () => {
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

  const [, { execute: login }] = useAsyncFn(async (event?: MouseEvent<HTMLButtonElement>) => {
    event?.preventDefault()
    if (authorizeUrlState.result) {
      authorizeWindow.current = openAuthWindow(authorizeUrlState.result)
      const needsLogin = await checkNeedsLogin()
      if (needsLogin === false) {
        onLogin()
      }
    }
  })

  useEffect(() => {
    if (authorizeUrlState.result) {
      login()
    }
  }, [login, authorizeUrlState.result])

  const loginPending = needsLoginState.status === 'loading' || isAuthWindowOpening
  const loginSuccess = needsLoginState.status !== 'loading' && needsLoginState.result === false
  const showLoading = authorizeWindow.current && (loginPending || loginSuccess)

  return (
    <div className='flex flex-col items-stretch justify-center gap-y-4 px-10 text-sm'>
      <BaseButton
        data-testid='authorize-link'
        href={authorizeUrlState.result}
        onClick={login}
        rel='noreferrer'
        styleType='primary'
        tabIndex={0}
        tag='a'
        target='_blank'
      >
        <span
          className={clsx('mr-2 inline-block size-5 shrink-0', {
            'icon-[logos--dropbox]': cloudService === 'dropbox',
            'icon-[logos--google-icon]': cloudService === 'google-drive',
            'icon-[logos--microsoft-icon]': cloudService === 'onedrive',
          })}
        />
        <span className='shrink-0'>{t('Sign in with', { service: cloudServiceMap[cloudService] })}</span>
        {showLoading ? <span className='icon-[line-md--loading-loop] size-5 shrink-0' /> : null}
      </BaseButton>
      {showReturnHome ? <ReturnToHomeButton /> : null}
    </div>
  )
}
