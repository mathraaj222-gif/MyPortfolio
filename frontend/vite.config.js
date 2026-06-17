import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const VITE_API_URL = import.meta.env.VITE_API_URL

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/': {
        target: VITE_API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
