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
        <CloudServiceLogin cloudService={'onedrive'} onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  if (error.status === 401) {
    return (
      <BaseDialogContent>
        <CloudServiceLogin cloudService={'google-drive'} onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  console.log(error)

  // todo: needs better error text
  return (
    <BaseDialogContent>
      <div>{JSON.stringify(error)}</div>
    </BaseDialogContent>
  )
}
