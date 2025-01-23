import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/Auth'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()


// Add the router globally to all stores
pinia.use(({ store }) => {
    store.router = markRaw(router)
});

app.use(pinia)
app.use(router)

const authStore = useAuthStore()
authStore.init();

app.mount('#app')

