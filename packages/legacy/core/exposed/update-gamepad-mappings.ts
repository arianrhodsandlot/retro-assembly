import { isEqual } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'
import { defaultGamepadMapping } from '../constants/input'

export function updateGamepadMappings(
  mappings: {
    mapping: Record<number | string, string>
    name: string
  }[],
) {
  const [firstMapping] = mappings
  if (!isEqual(firstMapping.mapping, defaultGamepadMapping)) {
    if (firstMapping?.name === '') {
      firstMapping.mapping = defaultGamepadMapping
    } else {
      mappings.unshift({ mapping: defaultGamepadMapping, name: '' })
    }
  }

  return PreferenceParser.set({
    name: 'gamepadMappings',
    value: mappings,
  })
}
