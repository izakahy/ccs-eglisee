import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'


const isArtisan = process.argv.includes('--artisan'); // Toggle via CLI flag
const apiTarget = isArtisan ? 'http://127.0.0.1:8000' : 'http://localhost';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api' : {
        target: apiTarget,
        changeOrigin: true,
        headers: {
          Accept: 'application/json',
          "Content-type": 'application/json',
        }
      }
    }
  }
})
