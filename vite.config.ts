import react from '@vitejs/plugin-react-swc'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: { host: true },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Retro Assembly',
        short_name: 'Retro Assembly',
        description: 'Your personal retro game collection museum in your browser',
        theme_color: '#be123c',
        icons: [
          { src: '/assets/logo/logo-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/logo/logo-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ],
})
