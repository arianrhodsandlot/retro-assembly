import { PreferenceParser } from '../classes/preference-parser'

export function isPreferenceValid() {
  const preference = new PreferenceParser()
  const configProviderType = preference.get('configProviderType')
  const stateProviderType = preference.get('stateProviderType')
  const romProviderType = preference.get('romProviderType')
  const configDirectory = preference.get('configDirectory')
  const stateDirectory = preference.get('stateDirectory')
  const romDirectory = preference.get('romDirectory')

  const values = [configProviderType, stateProviderType, romProviderType, configDirectory, stateDirectory]
  if (romProviderType !== 'local') {
    values.push(romDirectory)
  }
  if (values.some((value) => !value)) {
    return false
  }

  const directories = [configDirectory, stateDirectory]
  return directories.every(Boolean)
}
