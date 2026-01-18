import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { MKPThemes } from '../themes'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'mkpLightTheme',
    themes: {
      mkpLightTheme: {
        ...MKPThemes.mkpLightTheme,
        dark: false,
      },
      mkpDarkTheme: {
        ...MKPThemes.mkpDarkTheme,
        dark: true,
      },
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
