import type { CloudService } from '.'

function isOnedriveEnabled() {
  return Boolean(import.meta.env.VITE_ONEDRIVE_CLIENT_ID)
}

function isGoogleDriveEnabled() {
  return (
    Boolean(import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID) &&
    Boolean(import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_SECRET) &&
    Boolean(import.meta.env.VITE_GOOGLE_DRIVE_API_KEY)
  )
}

function isDropboxEnabled() {
  return Boolean(import.meta.env.VITE_DROPBOX_CLIENT_ID)
}

export function isCloudServiceEnabled(cloudService: CloudService) {
  if (cloudService === 'onedrive') {
    return isOnedriveEnabled()
  }
  if (cloudService === 'google-drive') {
    return isGoogleDriveEnabled()
  }
  if (cloudService === 'dropbox') {
    return isDropboxEnabled()
  }
  return false
}
