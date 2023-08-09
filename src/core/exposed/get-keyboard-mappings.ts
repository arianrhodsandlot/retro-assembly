import { PreferenceParser } from '../classes/preference-parser'

export function getKeyboardMappings() {
  return PreferenceParser.get('keyboardMappings')
}
