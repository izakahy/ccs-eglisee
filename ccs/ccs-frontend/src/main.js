import './assets/main.css'

import { createApp, markRaw } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/Auth'

import App from './App.vue'
import router, { addDynamicRoutes, initializeRouter } from './router'
import { useNavigationStore } from './stores/NavItems/Navigation'
import i18n from './language/i18n'

const app = createApp(App)
const pinia = createPinia()


// Add the router globally to all stores
pinia.use(({ store }) => {
    store.router = markRaw(router)
});

app.use(pinia)
app.use(router)
app.use(i18n);


// Initialize app
async function startApp() {
    const navigationStore = useNavigationStore();

    // Mount the app immediately after restoring from session
    const restored = navigationStore.restoreFromSession();
    if (restored) {
        addDynamicRoutes();
    }
    app.mount('#app'); // Mount early, let skeleton show while fetching

    // Fetch data in the background
    try {
        await initializeRouter(); 
        const authStore = useAuthStore();
        authStore.init(); 
    } catch (error) {
        console.error('Failed to initialize app data:', error);
    }
}

startApp().catch((error) => {
    console.error('Failed to start application:', error)
})
