import { PreferenceParser } from '../classes/preference-parser'

export function getGamepadMappings() {
  return PreferenceParser.get('gamepadMappings')
}
