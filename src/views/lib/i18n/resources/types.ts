import { type en } from './en'

type TranslationKey = keyof typeof en.translation
export type Translation = Record<TranslationKey, string>
