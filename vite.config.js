import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5174,
    strictPort: true,
    hmr: {
      port: 5174,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: [
      '5174-iohe514ekdhbg38vem0q2-d27c5f69.manusvm.computer',
    ],
  },
  plugins: [react(),tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
