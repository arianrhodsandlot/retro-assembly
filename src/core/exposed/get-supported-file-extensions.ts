import { extSystemMap } from '../constants/systems'

export function getSupportedFileExtensions() {
  return Object.keys(extSystemMap)
}
