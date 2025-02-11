import { useTranslation } from 'react-i18next'
import { CloudServiceLoginButton } from '../../../../common/cloud-service-login-button'
import { BaseCallout } from '../../../../primitives/base-callout'

export function DropboxLoginEntry({ onFinished }: { onFinished: () => void }) {
  const { t } = useTranslation()

  return (
    <div className='flex h-full flex-col'>
      <BaseCallout>
        <div className='flex items-start'>
          <div>
            <span className='icon-[mdi--bell] mr-2 mt-[2px] size-4' />
          </div>
          <div>{t('To select a ROMs directory from your Dropbox, you need to sign in with Dropbox first.')}</div>
        </div>
      </BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton cloudService='dropbox' onLogin={onFinished} />
      </div>
    </div>
  )
}
