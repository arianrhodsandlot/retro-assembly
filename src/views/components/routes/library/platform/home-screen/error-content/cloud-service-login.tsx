import { useTranslation } from 'react-i18next'
import type { CloudService } from '../../../../../../../core'
import { CloudServiceLoginButton } from '../../../../../common/cloud-service-login-button'
import { BaseCallout } from '../../../../../primitives/base-callout'

interface CloudServiceLoginProps {
  cloudService: CloudService
  onSolve: () => void
}

export function CloudServiceLogin({ cloudService, onSolve }: CloudServiceLoginProps) {
  const { t } = useTranslation()

  const loginNameMap = {
    'google-drive': 'Google Drive',
    onedrive: 'OneDrive',
  }
  return (
    <div>
      <BaseCallout>
        <div className='flex items-start'>
          <div>
            <span className='icon-[mdi--bell] mr-2 mt-[2px] size-4' />
          </div>
          <div>{t('Your login status is expired. Please login again.', { loginName: loginNameMap[cloudService] })}</div>
        </div>
      </BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton cloudService={cloudService} onLogin={onSolve} showReturnHome />
      </div>
    </div>
  )
}
