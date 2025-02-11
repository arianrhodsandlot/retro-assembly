import { PreferenceParser } from '../classes/preference-parser'

export function getProvider() {
  return PreferenceParser.get('romProviderType')
}
