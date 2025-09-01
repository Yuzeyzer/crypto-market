import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      // твой фронт зовёт /api/market
      '/api': {
        target: 'https://user26614.requestly.tech',
        changeOrigin: true,
        secure: false,
        // /api/market -> /test/api/market
        rewrite: (path) => path.replace(/^\/api/, '/test/api'),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
