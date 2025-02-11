import { getProvider } from './get-provider'

export function isUsingDemo() {
  return getProvider() === 'public'
}
