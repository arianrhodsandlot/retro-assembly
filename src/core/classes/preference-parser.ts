import mitt from 'mitt'
import { defaultGamepadMapping, defaultKeyboardMapping } from '../constants/input'
import { getStorageByKey, setStorageByKey } from '../helpers/storage'

type InputMapping = Record<string, string>

interface PreferenceValues {
  configDirectory: string
  configProviderType: string
  gamepadMappings: { mapping: InputMapping; name: string }[]
  keyboardMappings: { mapping: InputMapping }[]
  romDirectory: string
  romProviderType: string
  stateDirectory: string
  stateProviderType: string
}

const defaultPreferences: PreferenceValues = {
  configDirectory: '',
  configProviderType: 'public',
  gamepadMappings: [{ mapping: defaultGamepadMapping, name: '' }],
  keyboardMappings: [{ mapping: defaultKeyboardMapping }],
  romDirectory: '',
  romProviderType: 'public',
  stateDirectory: '',
  stateProviderType: 'public',
}

type PreferenceName = keyof typeof defaultPreferences
type PreferenceValue = PreferenceValues[PreferenceName]

export class PreferenceParser {
  static readonly emitter = mitt<{
    updated: { name: string; values: PreferenceValues }
  }>()
  static readonly storageKey = 'preference'

  private preferenceValues: PreferenceValues | undefined

  constructor() {
    this.loadFromStorage()
  }

  static get(name: Exclude<PreferenceName, 'gamepadMappings' | 'keyboardMappings'>): string
  static get(name: 'gamepadMappings'): PreferenceValues['gamepadMappings']
  static get(name: 'keyboardMappings'): PreferenceValues['keyboardMappings']
  static get(name?: any): PreferenceValue {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.get(name)
  }

  static offUpdated(callback: (params: { name: string; values: PreferenceValues }) => void) {
    PreferenceParser.emitter.off('updated', callback)
  }

  static onUpdated(callback: (params: { name: string; values: PreferenceValues }) => void) {
    PreferenceParser.emitter.on('updated', callback)
  }

  static set({ name, value }: { name: PreferenceName; value: any }) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.set({ name, value })
  }

  get(name: Exclude<PreferenceName, 'gamepadMappings' | 'keyboardMappings'>): string
  get(name: 'gamepadMappings'): PreferenceValues['gamepadMappings']
  get(name: 'keyboardMappings'): PreferenceValues['keyboardMappings']
  get(name?: any): PreferenceValue {
    this.loadFromStorage()
    return this.preferenceValues?.[name] || defaultPreferences[name]
  }

  set({ name, value }: { name: PreferenceName; value: any }) {
    this.preferenceValues ??= defaultPreferences
    this.preferenceValues[name] = value
    this.saveToStorage()
    PreferenceParser.emitter.emit('updated', { name, values: this.preferenceValues })
  }

  private loadFromStorage() {
    this.preferenceValues = getStorageByKey(PreferenceParser.storageKey)
  }

  private saveToStorage() {
    setStorageByKey({ key: PreferenceParser.storageKey, value: this.preferenceValues })
  }
}
