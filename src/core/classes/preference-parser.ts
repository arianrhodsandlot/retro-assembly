import { defaultGamepadMapping } from '../constants/input'
import { getStorageByKey, setStorageByKey } from '../helpers/storage'

const defaultPreferences = {
  configProviderType: 'local',
  stateProviderType: 'local',
  romProviderType: 'local',
  configDirectory: '',
  stateDirectory: '',
  romDirectory: '',
  gamepadMappings: [{ name: '', mapping: defaultGamepadMapping }],
}

type PreferenceName = keyof typeof defaultPreferences

export class PreferenceParser {
  static storageKey = 'preference'

  private preferenceValues

  constructor() {
    this.loadFromStorage()
  }

  static get(key: PreferenceName) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.get(key)
  }

  static set({ name, value }: { name: PreferenceName; value: any }) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.set({ name, value })
  }

  get(): typeof this.preferenceValues
  get(name: PreferenceName): any
  get(name?: PreferenceName) {
    this.loadFromStorage()
    if (name === undefined) {
      return this.preferenceValues
    }
    return this.preferenceValues?.[name] || defaultPreferences[name]
  }

  set({ name, value }: { name: PreferenceName; value: any }) {
    this.preferenceValues[name] = value
    this.saveToStorage()
  }

  private loadFromStorage() {
    this.preferenceValues = getStorageByKey(PreferenceParser.storageKey)
  }

  private saveToStorage() {
    setStorageByKey({ key: PreferenceParser.storageKey, value: this.preferenceValues })
  }
}

window.PreferenceParser = PreferenceParser
