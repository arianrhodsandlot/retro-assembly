import { BaseDialogContent } from '../../primitives/base-dialog-content'
import { CloudServiceLogin } from './cloud-service-login'
import { LocalFilePermision } from './local-file-permision'

export function ErrorContent({ error, onSolve }: { error: any; onSolve: () => void }) {
  if (error instanceof DOMException && error.name === 'SecurityError') {
    return (
      <BaseDialogContent>
        <LocalFilePermision onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  if (error.statusCode === 401 || error.response?.status === 400) {
    return (
      <BaseDialogContent>
        <CloudServiceLogin showReturnHome cloudService={'onedrive'} onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  if (error.status === 401) {
    return (
      <BaseDialogContent>
        <CloudServiceLogin showReturnHome cloudService={'google-drive'} onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  console.warn(error, error.stack)

  // todo: needs better error text
  return (
    <BaseDialogContent>
      <div>Failed to load games.</div>
    </BaseDialogContent>
  )
}
