import { BaseDialogContent } from '../../primitives/base-dialog-content'
import { LocalFilePermision } from './local-file-permision'
import { OnedriveLogin } from './onedrive-login'

export function ErrorContent({ error, onSolve }: { error: any; onSolve: () => void }) {
  if (error instanceof DOMException && error.name === 'SecurityError') {
    return (
      <BaseDialogContent>
        <LocalFilePermision onSolve={onSolve} />
      </BaseDialogContent>
    )
  }

  if (error.statusCode === 401) {
    return (
      <BaseDialogContent>
        <OnedriveLogin onSolve={onSolve} />
      </BaseDialogContent>
    )
  }
}
