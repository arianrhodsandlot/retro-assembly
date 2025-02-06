import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import react from '@vitejs/plugin-react-swc'
import { formatISO } from 'date-fns'
import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(async () => {
  const { stdout: revision } = await promisify(exec)('git rev-parse HEAD')
  const shortVersion = revision.trim().slice(0, 7)

  return {
    build: { rollupOptions: { input: ['index.html', 'privacy-policy.html'] } },
    define: {
      BUILD_TIME: JSON.stringify(formatISO(new Date())),
      GIT_VERSION: JSON.stringify(shortVersion),
    },
    plugins: [
      react(),
      splitVendorChunkPlugin(),
      VitePWA({
        devOptions: { enabled: false },
        manifest: {
          description: 'A personal retro game collection cabinet in your browser',
          icons: [
            { sizes: '192x192', src: '/assets/logo/logo-192x192.png', type: 'image/png' },
            { purpose: 'any', sizes: '512x512', src: '/assets/logo/logo-512x512.png', type: 'image/png' },
            { purpose: 'maskable', sizes: '512x512', src: '/assets/logo/maskable-512x512.png', type: 'image/png' },
          ],
          name: 'RetroAssembly',
          short_name: 'RetroAssembly',
          theme_color: '#be123c',
        },
        registerType: 'autoUpdate',
      }),
    ],
    server: { host: true },
  }
})
