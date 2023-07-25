import { CloudServiceLoginButton } from '../../common/cloud-service-login-button'
import { BaseCallout } from '../../primitives/base-callout'

interface CloudServiceLoginProps {
  cloudService: 'onedrive' | 'google-drive' | 'dropbox'
  onSolve: () => void
}
export function CloudServiceLogin({ cloudService, onSolve }: CloudServiceLoginProps) {
  const loginNameMap = {
    onedrive: 'OneDrive',
    'google-drive': 'Google Drive',
  }
  return (
    <div>
      <BaseCallout>
        <div className='flex items-start'>
          <div>
            <span className='icon-[mdi--bell] mr-2 mt-[2px] h-4 w-4' />
          </div>
          <div>Your {loginNameMap[cloudService]} login status is expired. Please login again.</div>
        </div>
      </BaseCallout>

      <div className='mt-4'>
        <CloudServiceLoginButton cloudService={cloudService} onLogin={onSolve} showReturnHome />
      </div>
    </div>
  )
}
