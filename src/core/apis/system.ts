import { globalInstances } from './global-instances'

export const system = {
  preference: globalInstances.preference,

  isUsingLocal() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    return romProviderType === 'local'
  },

  setFileSystemProviderType(type: 'local' | 'onedrive') {
    const { preference } = globalInstances
    preference.set({ name: 'configProviderType', value: type })
    preference.set({ name: 'stateProviderType', value: type })
    preference.set({ name: 'romProviderType', value: type })
  },

  setWorkingDirectory(path: string) {
    const { preference } = globalInstances
    preference.set({ name: 'configDirectory', value: `${path}retro-assembly/` })
    preference.set({ name: 'stateDirectory', value: `${path}retro-assembly/states/` })
    preference.set({ name: 'romDirectory', value: path })
  },

  isPreferenceValid() {
    const { preference } = globalInstances
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
    if (directories.some((directory) => !directory.endsWith('/'))) {
      return false
    }

    return true
  },
}

window.system = system
