import { PreferenceParser } from '../classes/preference-parser'

export function isUsingLocal() {
  const romProviderType = PreferenceParser.get('romProviderType')
  return romProviderType === 'local'
}
