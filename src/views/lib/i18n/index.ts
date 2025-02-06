import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import { resources } from './resources'

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: import.meta.env.DEV,
    detection: {
      caches: [],
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    resources,
  })
