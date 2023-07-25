import { PreferenceParser } from '../classes/preference-parser'

export function isUsingDropbox() {
  const romProviderType = PreferenceParser.get('romProviderType')
  return romProviderType === 'dropbox'
}
