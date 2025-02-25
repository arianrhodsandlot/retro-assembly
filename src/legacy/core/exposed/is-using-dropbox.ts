import { getProvider } from './get-provider'

export function isUsingDropbox() {
  return getProvider() === 'dropbox'
}
