import { PreferenceParser } from '../classes/preference-parser'

export function isUsingDemo() {
  const romProviderType = PreferenceParser.get('romProviderType')
  return romProviderType === 'demo'
}
