import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import type { Hono } from 'hono'
import { type Config, defineConfig } from 'waku/config'

export default defineConfig({
  ...(import.meta.env && !import.meta.env.PROD
    ? {
        unstable_honoEnhancer: ((createApp: (app: Hono) => Hono) => {
          const handlerPromise = import('./src/middlewares/cloudflare-dev-server.ts').then(({ cloudflareDevServer }) =>
            cloudflareDevServer({
              // https://developers.cloudflare.com/workers/wrangler/api/#parameters-1
              persist: {
                path: '.wrangler/state/v3',
              },
            }),
          )
          return (appToCreate: Hono) => {
            const app = createApp(appToCreate)
            return {
              fetch: async (req: Request) => {
                const devHandler = await handlerPromise
                return devHandler(req, app)
              },
            }
          }
        }) as Config['unstable_honoEnhancer'],
      }
    : {}),

  middleware() {
    return [
      import('waku/middleware/context'),

      import('./src/middlewares/cloudflare-middleware.ts'),
      import('./src/middlewares/globals.ts'),
      import('./src/middlewares/auth.ts'),

      import('waku/middleware/dev-server'),
      import('waku/middleware/handler'),
    ]
  },

  unstable_viteConfigs: {
    common() {
      return {
        plugins: [tailwindcss()],
        resolve: {
          alias: {
            '@': path.join(import.meta.dirname, 'src'),
          },
        },
      }
    },
  },
})
