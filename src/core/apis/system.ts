import { get, set } from 'idb-keyval'
import { isNil } from 'lodash-es'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { globalInstances } from './global-instances'

export const system = {
  preference: globalInstances.preference,

  isUsingLocal() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    return romProviderType === 'local'
  },

  async updateSettings({
    fileSystem,
    directory,
    handle,
  }: {
    fileSystem?: 'local' | 'onedrive'
    directory?: string
    handle?: FileSystemHandle
  }) {
    if (!isNil(fileSystem)) {
      system.setFileSystemProviderType(fileSystem)
    }
    if (!isNil(directory)) {
      system.setWorkingDirectory(directory)
    }
    if (!isNil(handle)) {
      await system.setLocalFileSystemHandle(handle)
    }
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

  async setLocalFileSystemHandle(handle) {
    const handles = (await get('local-file-system-handles')) || {}
    handles.rom = handle
    await set('local-file-system-handles', handles)
  },

  async needsSetup() {
    if (!system.isPreferenceValid()) {
      return true
    }

    if (system.isUsingLocal()) {
      const handles = (await get('local-file-system-handles')) || {}
      const handle = handles.rom
      if (!handle) {
        return true
      }
    }

    return false
  },

  async needsOnedriveLogin() {
    return !(await OneDriveProvider.validateAccessToken())
  },

  getOnedriveAuthorizeUrl: OneDriveProvider.getAuthorizeUrl,

  isRetrievingToken: OneDriveProvider.isRetrievingToken,

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
