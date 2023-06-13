import { CloudServiceLoginButton } from '../../common/cloud-service-login-button'
import { BaseCallout } from '../../primitives/base-callout'

export function OnedriveLogin({ onSolve }: { onSolve: () => void }) {
  return (
    <div>
      <BaseCallout>Your OneDrive login status is expired. Please login again.</BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton onLogin={onSolve} />
      </div>
    </div>
  )
}
