import { clear, get, set } from 'idb-keyval'
import { isNil } from 'lodash-es'
import {
  GoogleDriveProvider,
  Preference,
  detectLocalHandleExistence,
  detectLocalHandlePermission,
  requestLocalHandle,
} from '..'
import { LocalProvider } from '../classes/file-system-providers/local-provider'
import { OneDriveProvider } from '../classes/file-system-providers/one-drive-provider'
import { globalInstances } from './global-instances'

export const system = {
  preference: globalInstances.preference,

  isUsingLocal() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    return romProviderType === 'local'
  },

  isUsingOnedrive() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    return romProviderType === 'onedrive'
  },

  async updateSettings({
    fileSystem,
    directory,
    handle,
  }: {
    fileSystem?: 'local' | 'onedrive' | 'google-drive'
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

  setFileSystemProviderType(type: 'local' | 'onedrive' | 'google-drive') {
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

  async checkNeedsSetup() {
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

  async needsLogin(type: 'onedrive' | 'google-drive') {
    switch (type) {
      case 'onedrive':
        return !(await OneDriveProvider.validateAccessToken())
      case 'google-drive':
        return !(await GoogleDriveProvider.validateAccessToken())
      default:
        throw new Error('invalid token type')
    }
  },

  getTokenStorageKey(type: 'onedrive' | 'google-drive') {
    switch (type) {
      case 'onedrive':
        return OneDriveProvider.tokenStorageKey
      case 'google-drive':
        return GoogleDriveProvider.tokenStorageKey
      default:
        throw new Error('invalid token type')
    }
  },

  getAuthorizeUrl(type: 'onedrive' | 'google-drive') {
    switch (type) {
      case 'onedrive':
        return OneDriveProvider.getAuthorizeUrl()
      case 'google-drive':
        return GoogleDriveProvider.getAuthorizeUrl()
      default:
        throw new Error('invalid token type')
    }
  },

  authorize(type: 'onedrive' | 'google-drive') {
    return open(system.getAuthorizeUrl(type))
  },

  async retrieveToken(type: 'onedrive' | 'google-drive') {
    switch (type) {
      case 'onedrive':
        await OneDriveProvider.retrieveToken()
        break
      case 'google-drive':
        await GoogleDriveProvider.retrieveToken()
        break
      default:
        throw new Error('invalid token type')
    }
  },

  isPreferenceValid() {
    const preference = new Preference()
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
    return directories.every((directory) => directory.endsWith('/'))
  },

  async start() {
    const preference = new Preference()
    globalInstances.preference = preference
    const type = preference.get('romProviderType')
    switch (type) {
      case 'local':
        globalInstances.fileSystemProvider = await LocalProvider.getSingleton()
        break
      case 'onedrive':
        globalInstances.fileSystemProvider = await OneDriveProvider.getSingleton()
        break
      case 'google-drive':
        globalInstances.fileSystemProvider = await GoogleDriveProvider.getSingleton()
        break
      default:
        throw new Error('unknown rom provider type')
    }
  },

  async needsRegrantLocalPermission() {
    const { preference } = globalInstances
    const romProviderType = preference.get('romProviderType')
    if (romProviderType !== 'local') {
      return false
    }

    const exist = await detectLocalHandleExistence('rom')
    if (!exist) {
      return false
    }

    const hasPermission = await detectLocalHandlePermission({ name: 'rom', mode: 'readwrite' })
    return !hasPermission
  },

  async grantPermissionManually() {
    return await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
  },

  async teardown() {
    localStorage.clear()
    await clear()
    globalInstances.fileSystemProvider = undefined
  },
}

window.system = system
