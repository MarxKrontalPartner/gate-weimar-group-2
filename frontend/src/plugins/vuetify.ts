import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { MKPThemes } from '../themes'

// Load saved theme from localStorage, default to light theme
const savedTheme =
  typeof window !== 'undefined' ? localStorage.getItem('app_theme') || 'light' : 'light'

// Map saved preference to Vuetify theme names
const defaultTheme = savedTheme === 'dark' ? 'mkpDarkTheme' : 'mkpLightTheme'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme,
    themes: {
      mkpLightTheme: MKPThemes.mkpLightTheme,
      mkpDarkTheme: MKPThemes.mkpDarkTheme,
    },
  },
  defaults: {
    VAppBar: {
      VIcon: {
        color: 'on-surface',
      },
    },
  },
})
