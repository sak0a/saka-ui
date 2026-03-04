import { createApp } from 'vue'
import './style.css'
import '@mdi/font/css/materialdesignicons.css'
import App from './App.vue'
import router from './router'
import { initTheme } from './composables/useTheme'

// Initialize theme immediately
initTheme()

const app = createApp(App)
app.use(router)
app.mount('#app')
