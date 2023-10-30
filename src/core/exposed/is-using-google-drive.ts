import { getProvider } from './get-provider'

export function isUsingGoogleDrive() {
  return getProvider() === 'google-drive'
}
