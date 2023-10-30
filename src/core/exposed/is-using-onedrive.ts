import { getProvider } from './get-provider'

export function isUsingOnedrive() {
  return getProvider() === 'onedrive'
}
