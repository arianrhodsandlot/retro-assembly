import { useTranslation } from 'react-i18next'
import { CloudServiceLoginButton } from '../../../../common/cloud-service-login-button'
import { BaseCallout } from '../../../../primitives/base-callout'

export function OnedriveLoginEntry({ onFinished }: { onFinished: () => void }) {
  const { t } = useTranslation()

  return (
    <div className='flex h-full flex-col'>
      <BaseCallout>
        <div className='flex items-start'>
          <div>
            <span className='icon-[mdi--bell] mr-2 mt-[2px] size-4' />
          </div>
          <div>{t('To select a ROMs directory from your OneDrive, you need to sign in with Microsoft first.')}</div>
        </div>
      </BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton cloudService='onedrive' onLogin={onFinished} />
      </div>
    </div>
  )
}
