import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
<<<<<<< HEAD
        target: 'http://127.0.0.1:5001',
=======
        target: 'http://localhost:5999',
>>>>>>> 495dada121cfe2e5d47076c562e08ec1d2f9af6a
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5999',
        ws: true,
        changeOrigin: true,
      }
    }
  }
})
