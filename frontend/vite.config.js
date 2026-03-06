import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuración de Vite para el frontend de Piñatería Arcoiris
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Proxy de las peticiones al backend durante desarrollo
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
