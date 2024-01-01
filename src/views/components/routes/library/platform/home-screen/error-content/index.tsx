import { useTranslation } from 'react-i18next'
import { isUsingDropbox, isUsingGoogleDrive, isUsingOnedrive } from '../../../../../../../core'
import { ReturnToHomeButton } from '../../../../../common/return-to-home-button'
import { BaseButton } from '../../../../../primitives/base-button'
import { BaseCallout } from '../../../../../primitives/base-callout'
import { BaseDialogContent } from '../../../../../primitives/base-dialog-content'
import { CloudServiceLogin } from './cloud-service-login'
import { LocalFilePermision } from './local-file-permision'

function isInvalidTokenError(error: any) {
  error ??= {}
  const { message, status, statusCode, response } = error
  return message === 'invalid token' || statusCode === 401 || status === 401 || response?.status === 400
}

export function ErrorContent({ error, onSolve }: { error: any; onSolve: () => void }) {
  const { t } = useTranslation()

  if (error instanceof DOMException && error.name === 'SecurityError') {
    return (
      <BaseDialogContent>
        <LocalFilePermision onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  if (isInvalidTokenError(error)) {
    let cloudService = ''
    if (isUsingOnedrive()) {
      cloudService = 'onedrive'
    } else if (isUsingGoogleDrive()) {
      cloudService = 'google-drive'
    } else if (isUsingDropbox()) {
      cloudService = 'dropbox'
    }
    if (cloudService) {
      return (
        <BaseDialogContent>
          <CloudServiceLogin cloudService={'onedrive'} onSolve={onSolve} />
        </BaseDialogContent>
      )
    }
  }

  console.warn(error)

  // todo: needs better error text
  return (
    <BaseDialogContent>
      <div className='flex w-80 flex-col items-stretch gap-2'>
        <BaseCallout>
          <div className='flex items-start'>
            <div>
              <span className='icon-[mdi--bell] mr-2 mt-[2px] h-4 w-4 ' />
            </div>
            <div>{t('Failed to load games.')}</div>
          </div>
        </BaseCallout>
        <BaseButton className='mt-2' onClick={onSolve} styleType='primary'>
          <span className='icon-[mdi--reload] h-6 w-6' />
          {t('Retry')}
        </BaseButton>
        <ReturnToHomeButton />
      </div>
    </BaseDialogContent>
  )
}
