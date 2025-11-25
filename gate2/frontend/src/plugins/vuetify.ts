import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { MKPThemes } from '../themes'

const isDarkModePreferred = window.matchMedia('(prefers-color-scheme: light)').matches

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: isDarkModePreferred ? 'mkpDarkTheme' : 'mkpLightTheme',
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
