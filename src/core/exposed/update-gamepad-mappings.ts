import { isEqual } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'
import { defaultGamepadMapping } from '../constants/input'

export function updateGamepadMappings(
  mappings: {
    name: string
    mapping: Record<string | number, string>
  }[],
) {
  const [firstMapping] = mappings
  if (!isEqual(firstMapping, defaultGamepadMapping)) {
    if (firstMapping?.name === '') {
      firstMapping.mapping = defaultGamepadMapping
    } else {
      mappings.unshift({ name: '', mapping: defaultGamepadMapping })
    }
  }

  return PreferenceParser.set({
    name: 'gamepadMappings',
    value: mappings,
  })
}
