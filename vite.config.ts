import react from '@vitejs/plugin-react-swc'
import { defineConfig, splitVendorChunkPlugin } from 'vite'

export default defineConfig({
  publicDir: 'src/vendor',
  plugins: [react(), splitVendorChunkPlugin()],
  server: { host: true },
})
