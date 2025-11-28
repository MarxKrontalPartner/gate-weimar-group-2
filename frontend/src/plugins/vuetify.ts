import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { MKPThemes } from '../themes'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'mkpLightTheme',     // <-- FORCE LIGHT THEME
    themes: {
      mkpLightTheme: MKPThemes.mkpLightTheme
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
  