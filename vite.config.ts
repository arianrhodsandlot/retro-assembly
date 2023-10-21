import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import htmlMinimize from '@sergeymakinen/vite-plugin-html-minimize'
import react from '@vitejs/plugin-react-swc'
import { formatISO } from 'date-fns'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(async () => {
  const { stdout: revision } = await promisify(exec)('git rev-parse HEAD')
  const shortVersion = revision.trim().slice(0, 7)

  return {
    server: { host: true },
    define: {
      GIT_VERSION: JSON.stringify(shortVersion),
      BUILD_TIME: JSON.stringify(formatISO(new Date())),
    },
    build: {
      rollupOptions: {
        input: ['index.html', 'privacy-policy.html'],
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              const namedChunks = ['nostalgist', 'jquery', 'dropbox', '@microsoft/microsoft-graph-client']
              for (const namedChunk of namedChunks) {
                if (id.includes(`/${namedChunk}/`)) {
                  return namedChunk.replace('@', '').replace('/', '-')
                }
              }
              const frameworkPackages = ['react', 'react-dom', '@radix-ui', 'framer-motion', 'react-window', 'wouter']
              for (const frameworkPackage of frameworkPackages) {
                if (id.includes(`/${frameworkPackage}/`)) {
                  return 'framework'
                }
              }
              return 'library'
            }
          },
        },
      },
    },
    plugins: [
      react(),
      // @ts-expect-error the package provided a wrong type decleration
      htmlMinimize.default(),
      VitePWA({
        registerType: 'autoUpdate',
        devOptions: { enabled: false },
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
  }
})
