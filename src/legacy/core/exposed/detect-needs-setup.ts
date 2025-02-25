import { get } from 'idb-keyval'
import { isPreferenceValid, isUsingLocal } from '.'

export async function detectNeedsSetup() {
  if (!isPreferenceValid()) {
    return true
  }

  if (isUsingLocal()) {
    const handles = (await get('local-file-system-handles')) || {}
    const handle = handles.rom
    if (!handle) {
      return true
    }
  }

  return false
}
