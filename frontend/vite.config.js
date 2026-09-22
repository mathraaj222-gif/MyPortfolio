import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Admin dashboard Vite config 2
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    // Split React + router into a separate vendor chunk so it gets cached
    // independently from your app code. On redeploy users only re-download
    // your changed code, not the entire React library (~140KB saved per deploy).
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons:  ['lucide-react'],
        }
      }
    }
  }
})
