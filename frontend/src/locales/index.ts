import { createI18n } from 'vue-i18n'
import en from './en.json'
import de from './de.json'

// Load saved language from localStorage, default to 'en' if not set
const savedLanguage =
  typeof window !== 'undefined' ? localStorage.getItem('app_language') || 'en' : 'en'

const i18n = createI18n({
  legacy: false,
  locale: savedLanguage,
  fallbackLocale: 'en',
  messages: {
    en,
    de,
  },
})

export default i18n
