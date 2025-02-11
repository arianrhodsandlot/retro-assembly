import { isCloudServiceEnabled, isLocalDirectorySelectorEnabled } from '../../../../../core'
import { DropboxButton } from './dropbox-button'
import { GoogleDriveButton } from './google-drive-button'
import { IconShortcutButton } from './icon-shortcut-button'
import { LocalButton } from './local-button'
import { OnedriveButton } from './onedrive-button'

const isOnedriveEnabled = isCloudServiceEnabled('onedrive')
const isGoogleDriveEnabled = isCloudServiceEnabled('google-drive')
const isDropboxEnabled = isCloudServiceEnabled('dropbox')

export function IconShortcutButtons() {
  return (
    <div className='flex-center mt-2 gap-4 text-xs text-white/60'>
      {isLocalDirectorySelectorEnabled() ? (
        <LocalButton>
          <IconShortcutButton type='local'>
            <span className='icon-[flat-color-icons--opened-folder] size-4' />
          </IconShortcutButton>
        </LocalButton>
      ) : null}
      {isOnedriveEnabled ? (
        <OnedriveButton>
          <IconShortcutButton type='onedrive'>
            <span className='icon-[logos--microsoft-onedrive] size-4' />
          </IconShortcutButton>
        </OnedriveButton>
      ) : null}
      {isDropboxEnabled ? (
        <DropboxButton>
          <IconShortcutButton type='dropbox'>
            <span className='icon-[logos--dropbox] size-4' />
          </IconShortcutButton>
        </DropboxButton>
      ) : null}
      {isGoogleDriveEnabled ? (
        <GoogleDriveButton>
          <IconShortcutButton type='google-drive'>
            <span className='icon-[logos--google-drive] size-4' />
          </IconShortcutButton>
        </GoogleDriveButton>
      ) : null}
    </div>
  )
}
