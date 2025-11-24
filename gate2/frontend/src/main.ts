import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify' // Lädt Vuetify styles
import './index.css' // Lädt Tailwind NACH Vuetify

const app = createApp(App)

app.use(router)
app.use(vuetify)

app.mount('#app')
