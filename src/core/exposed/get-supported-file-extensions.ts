import { extPlatformMap } from '../constants/platforms'

export function getSupportedFileExtensions() {
  return Object.keys(extPlatformMap)
}
