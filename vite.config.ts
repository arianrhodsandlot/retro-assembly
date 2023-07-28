import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: { host: true },
  build: { rollupOptions: { input: ['index.html', 'privacy-policy.html'] } },
  plugins: [
    react(),
    splitVendorChunkPlugin(),
    // @ts-expect-error the package provided a wrong type decleration
    htmlMinimize.default(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
      manifest: {
        name: 'Retro Assembly',
        short_name: 'Retro Assembly',
        description: 'A personal retro game collection cabinet in your browser',
        theme_color: '#be123c',
        icons: [
          { src: '/assets/logo/logo-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/logo/logo-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: '/assets/logo/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
