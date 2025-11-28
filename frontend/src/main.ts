import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './index.css'

// Import AG Charts component
import { AgCharts } from 'ag-charts-vue3'

const app = createApp(App)

// Register AG Charts globally
app.component('AgChartsVue', AgCharts)

app.use(router)
app.use(vuetify)

app.mount('#app')
