import { PreferenceParser } from '../classes/preference-parser'

export function isUsingGoogleDrive() {
  const romProviderType = PreferenceParser.get('romProviderType')
  return romProviderType === 'google-drive'
}
