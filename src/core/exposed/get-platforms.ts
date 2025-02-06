import { intersection } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'
import { platformFullNameMap, platformNamesSorted } from '../constants/platforms'
import { globalContext } from '../internal/global-context'

export async function getPlatforms() {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const directories = await fileSystem.list(romDirectory)
  const directoryNames = directories.map(({ name }) => name)
  const platformNames = intersection(platformNamesSorted, directoryNames)
  return (platformNames as typeof platformNamesSorted).map((platformName) => ({
    fullName: platformFullNameMap[platformName],
    name: platformName,
  }))
}
