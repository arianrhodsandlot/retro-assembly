import { getProvider } from './get-provider'

export function isUsingLocal() {
  return getProvider() === 'local'
}
