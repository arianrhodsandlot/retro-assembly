import { isEqual } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'
import { defaultKeyboardMapping } from '../constants/input'

export function updateKeyboardMappings(mappings: { mapping: Record<string, string> }[]) {
  const [mapping] = mappings
  if (isEqual(mapping.mapping, defaultKeyboardMapping)) {
    return PreferenceParser.set({ name: 'keyboardMappings', value: null })
  }
  return PreferenceParser.set({
    name: 'keyboardMappings',
    value: mappings,
  })
}
