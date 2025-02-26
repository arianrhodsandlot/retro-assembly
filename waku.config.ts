import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'waku/config'
import { enhance } from './src/middlewares/hono/enhance.ts'
import { middleware } from './src/middlewares/waku/middleware.ts'

export default defineConfig({
  middleware,
  unstable_honoEnhancer: enhance,
  unstable_viteConfigs: {
    common() {
      return {
        plugins: [tailwindcss()],
        resolve: { alias: { '@': path.join(import.meta.dirname, 'src') } },
      }
    },
  },
})
