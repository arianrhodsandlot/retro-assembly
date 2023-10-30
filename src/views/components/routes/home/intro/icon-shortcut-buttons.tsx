import { isCloudServiceEnabled, isLocalDirectorySelectorEnabled } from '../../../../../core'
import { DropboxButton } from './dropbox-button'
import { GoogleDriveButton } from './google-drive-button'
import { LocalButton } from './local-button'
import { OnedriveButton } from './onedrive-button'

const isOnedriveEnabled = isCloudServiceEnabled('onedrive')
const isGoogleDriveEnabled = isCloudServiceEnabled('google-drive')
const isDropboxEnabled = isCloudServiceEnabled('dropbox')

export function IconShortcutButtons() {
  return (
    <div className='mt-2 flex items-center justify-center gap-4 text-xs text-white/60'>
      {isOnedriveEnabled ? (
        <OnedriveButton>
          <button>
            <span className='icon-[logos--microsoft-onedrive] h-4 w-4' />
          </button>
        </OnedriveButton>
      ) : null}
      {isGoogleDriveEnabled ? (
        <GoogleDriveButton>
          <button>
            <span className='icon-[logos--google-drive] h-4 w-4' />
          </button>
        </GoogleDriveButton>
      ) : null}
      {isDropboxEnabled ? (
        <DropboxButton>
          <button>
            <span className='icon-[logos--dropbox] h-4 w-4' />
          </button>
        </DropboxButton>
      ) : null}
      {isLocalDirectorySelectorEnabled() ? (
        <LocalButton>
          <button>
            <span className='icon-[flat-color-icons--opened-folder] h-4 w-4' />
          </button>
        </LocalButton>
      ) : null}
    </div>
  )
}
