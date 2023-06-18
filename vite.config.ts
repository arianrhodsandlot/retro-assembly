import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  publicDir: 'src/vendor',
  plugins: [react()],
  server: {
    host: true,
  },
})
