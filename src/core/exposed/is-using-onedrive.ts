import { PreferenceParser } from '../classes/preference-parser'

export function isUsingOnedrive() {
  const romProviderType = PreferenceParser.get('romProviderType')
  return romProviderType === 'onedrive'
}
