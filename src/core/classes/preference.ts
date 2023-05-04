import { getStorageByKey, setStorageByKey } from '../helpers/storage'

const defaultPreferences = {
  systemProviderType: 'local',
  gameProviderType: 'local',
  systemDirectory: '',
  gameDirectory: '',
}

export class Preference {
  systemProviderType: string
  gameProviderType: string
  systemDirectory: string
  gameDirectory: string

  constructor() {
    this.systemProviderType = defaultPreferences.systemProviderType
    this.gameProviderType = defaultPreferences.gameProviderType
    this.systemDirectory = defaultPreferences.systemDirectory
    this.gameDirectory = defaultPreferences.gameDirectory
  }

  get value() {
    return {
      systemProviderType: this.systemProviderType,
      gameProviderType: this.gameProviderType,
      systemDirectory: this.systemDirectory,
      gameDirectory: this.gameDirectory,
    }
  }

  load() {
    return getStorageByKey('preference')
  }

  save() {
    const preference = setStorageByKey({ key: 'preference', value: this.value })
    console.log(preference)
  }
}

window.Preference = Preference
window.p = new Preference()
