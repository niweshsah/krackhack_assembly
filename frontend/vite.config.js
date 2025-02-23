import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    'global': {},
    'process.env': {}
  },
  resolve: {
    alias: {
      'buffer': 'buffer/'
    }
  },
  optimizeDeps: {
    include: ['buffer']
  }
})