import { globalInstances } from './global-instances'

export const system = {
  preference: globalInstances.preference,

  setFileSystemProviderType(type: 'local' | 'onedrive') {
    const { preference } = globalInstances
    preference.set({ name: 'configProviderType', value: type })
    preference.set({ name: 'stateProviderType', value: type })
    preference.set({ name: 'romProviderType', value: type })
  },

  setWorkingDirectory(path: string) {
    const { preference } = globalInstances
    preference.set({ name: 'configDirectory', value: path })
    preference.set({ name: 'stateDirectory', value: path })
    preference.set({ name: 'romDirectory', value: path })
  },

  validatePreference() {
    const { preference } = globalInstances
    const configProviderType = preference.get('configProviderType')
    const stateProviderType = preference.get('stateProviderType')
    const romProviderType = preference.get('romProviderType')
    const configDirectory = preference.get('configDirectory')
    const stateDirectory = preference.get('stateDirectory')
    const romDirectory = preference.get('romDirectory')
    const values = [
      configProviderType,
      stateProviderType,
      romProviderType,
      configDirectory,
      stateDirectory,
      romDirectory,
    ]

    return values.every(Boolean)
  },
}

window.system = system
