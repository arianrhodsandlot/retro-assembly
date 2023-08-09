import mitt from 'mitt'
import { defaultGamepadMapping, defaultKeyboardMapping } from '../constants/input'
import { getStorageByKey, setStorageByKey } from '../helpers/storage'

type InputMapping = Record<string, string>

interface PreferenceValues {
  configProviderType: string
  stateProviderType: string
  romProviderType: string
  configDirectory: string
  stateDirectory: string
  romDirectory: string
  gamepadMappings: { name: string; mapping: InputMapping }[]
  keyboardMappings: { mapping: InputMapping }[]
}

const defaultPreferences: PreferenceValues = {
  configProviderType: 'local',
  stateProviderType: 'local',
  romProviderType: 'local',
  configDirectory: '',
  stateDirectory: '',
  romDirectory: '',
  gamepadMappings: [{ name: '', mapping: defaultGamepadMapping }],
  keyboardMappings: [{ mapping: defaultKeyboardMapping }],
}

type PreferenceName = keyof typeof defaultPreferences
type PreferenceValue = PreferenceValues[PreferenceName]

export class PreferenceParser {
  static storageKey = 'preference'
  static emitter = mitt<{
    updated: { name: string; values: PreferenceValues }
  }>()

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

  static set({ name, value }: { name: PreferenceName; value: any }) {
    const preferenceParser = new PreferenceParser()
    return preferenceParser.set({ name, value })
  }

  static onUpdated(callback: (params: { name: string; values: PreferenceValues }) => void) {
    this.emitter.on('updated', callback)
  }

  static offUpdated(callback: (params: { name: string; values: PreferenceValues }) => void) {
    this.emitter.off('updated', callback)
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
