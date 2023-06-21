import { getStorageByKey, setStorageByKey } from '../helpers/storage'

const defaultPreferences = {
  configProviderType: 'local',
  stateProviderType: 'local',
  romProviderType: 'local',
  configDirectory: '',
  stateDirectory: '',
  romDirectory: '',
}

type PreferenceName = keyof typeof defaultPreferences

export class PreferenceParser {
  static storageKey = 'preference'

  private configProviderType = ''
  private stateProviderType = ''
  private romProviderType = ''
  private configDirectory = ''
  private stateDirectory = ''
  private romDirectory = ''

  constructor() {
    this.loadFromStorage()
  }

  private get value() {
    return {
      configProviderType: this.configProviderType,
      stateProviderType: this.stateProviderType,
      romProviderType: this.romProviderType,
      configDirectory: this.configDirectory,
      stateDirectory: this.stateDirectory,
      romDirectory: this.romDirectory,
    }
  }

  static get(key: PreferenceName) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.get(key)
  }

  static set({ name, value }: { name: PreferenceName; value: string }) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.set({ name, value })
  }

  get(): typeof this.value
  get(name: PreferenceName): string
  get(name?: PreferenceName) {
    this.loadFromStorage()
    if (name === undefined) {
      return this.value
    }
    return this.value[name]
  }

  set({ name, value }: { name: PreferenceName; value: string }) {
    this[name] = value
    this.saveToStorage()
  }

  private loadFromStorage() {
    const preference = getStorageByKey(PreferenceParser.storageKey)
    this.configProviderType = preference?.configProviderType ?? defaultPreferences.configProviderType
    this.stateProviderType = preference?.stateProviderType ?? defaultPreferences.stateProviderType
    this.romProviderType = preference?.romProviderType ?? defaultPreferences.romProviderType
    this.configDirectory = preference?.configDirectory ?? defaultPreferences.configDirectory
    this.stateDirectory = preference?.stateDirectory ?? defaultPreferences.stateDirectory
    this.romDirectory = preference?.romDirectory ?? defaultPreferences.romDirectory
  }

  private saveToStorage() {
    setStorageByKey({ key: PreferenceParser.storageKey, value: this.value })
  }
}
