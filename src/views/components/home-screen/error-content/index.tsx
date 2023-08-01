import { isUsingDropbox, isUsingGoogleDrive, isUsingOnedrive } from '../../../../core'
import { BaseButton } from '../../primitives/base-button'
import { BaseDialogContent } from '../../primitives/base-dialog-content'
import { CloudServiceLogin } from './cloud-service-login'
import { LocalFilePermision } from './local-file-permision'

function isInvalidTokenError(error: any) {
  return error.statusCode === 401 || error.status === 401 || error.response?.status === 400
}

export function ErrorContent({ error, onSolve }: { error: any; onSolve: () => void }) {
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

  console.warn(error, error.stack)

  // todo: needs better error text
  return (
    <BaseDialogContent>
      <div className='flex flex-col items-stretch'>
        <div>Failed to load games.</div>
        <BaseButton className='mt-2' onClick={onSolve}>
          Retry
        </BaseButton>
      </div>
    </BaseDialogContent>
  )
}
