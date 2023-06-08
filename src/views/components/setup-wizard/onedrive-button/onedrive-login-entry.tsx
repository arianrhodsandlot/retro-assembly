import { OnedriveLoginButton } from '../../common/onedrive-login-button'
import { BaseCallout } from '../../primitives/base-callout'

export function OnedriveLoginEntry({ onFinished }: { onFinished: () => void }) {
  return (
    <div className='flex h-full flex-col'>
      <BaseCallout>
        To select a roms directory from your Microsoft OneDrive, you need to login to Microsoft first.
      </BaseCallout>

      <div className='mt-4'>
        <OnedriveLoginButton onLogin={onFinished} />
      </div>
    </div>
  )
}
