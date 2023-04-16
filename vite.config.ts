import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'retroarch',
  plugins: [react()],
  server: {
    host: true,
  },
})
