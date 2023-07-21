import { PreferenceParser } from '../classes/preference-parser'

export function updateGamepadMappings(
  mappings: {
    name: string
    mapping: Record<string | number, string>
  }[],
) {
  return PreferenceParser.set({
    name: 'gamepadMappings',
    value: mappings,
  })
}
