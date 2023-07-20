import { intersection } from 'lodash-es'
import { PreferenceParser } from '../classes/preference-parser'
import { systemFullNameMap, systemNamesSorted } from '../constants/systems'
import { globalContext } from '../internal/global-context'

export async function peekSystems() {
  const { fileSystem } = globalContext
  if (!fileSystem) {
    throw new Error('fileSystem is not available')
  }

  const romDirectory = PreferenceParser.get('romDirectory')
  const directories = await fileSystem.peek(romDirectory)
  const directoryNames = directories?.map(({ name }) => name)
  const systemNames = intersection(systemNamesSorted, directoryNames)
  return (systemNames as typeof systemNamesSorted).map((systemName) => ({
    name: systemName,
    fullName: systemFullNameMap[systemName],
  }))
}
