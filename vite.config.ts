import react from '@vitejs/plugin-react-swc'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  publicDir: 'src/vendor',
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Retro Assembly',
        short_name: 'Retro Assembly',
        description: 'Retro Assembly',
        theme_color: '#dc2626',
        icons: [
          { src: './src/views/assets/logo/logo-192.png', sizes: '192x192', type: 'image/png' },
          { src: './src/views/assets/logo/logo-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
  server: { host: true },
})
