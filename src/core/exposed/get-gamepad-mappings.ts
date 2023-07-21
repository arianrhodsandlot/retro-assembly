import { PreferenceParser } from '../classes/preference-parser'

export function getGamepadMappings() {
  return PreferenceParser.get('gamepadMappings') as {
    name: string
    mapping: Record<string | number, string>
  }[]
}
