import { CloudServiceLoginButton } from '../../common/cloud-service-login-button'
import { BaseCallout } from '../../primitives/base-callout'

export function CloudServiceLogin({
  cloudService,
  onSolve,
}: {
  cloudService: 'onedrive' | 'google-drive'
  onSolve: () => void
}) {
  const loginNameMap = {
    onedrive: 'OneDrive',
    'google-drive': 'Google Drive',
  }
  return (
    <div>
      <BaseCallout>Your {loginNameMap[cloudService]} login status is expired. Please login again.</BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton cloudService={cloudService} onLogin={onSolve} />
      </div>
    </div>
  )
}
