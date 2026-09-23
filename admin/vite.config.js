import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin dashboard Vite config
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    proxy: {
      '/api/': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Split vendor chunks for faster load times and better browser caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react'],
        }
      }
    }
  }
})
