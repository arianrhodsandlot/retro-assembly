import type { Hono } from 'hono'
import { contextStorage } from 'hono/context-storage'
import { requestId } from 'hono/request-id'
import type { Config } from 'waku/config'
import { app as api } from '../../api/index.ts'
import { cloudflareDevServer } from './cloudflare-dev-server.ts'
import globals from './globals.ts'

const cloudflareDevServerHandler = cloudflareDevServer({
  // https://developers.cloudflare.com/workers/wrangler/api/#parameters-1
  persist: {
    path: '.wrangler/state/v3',
  },
})

type Enhancer = NonNullable<Config['unstable_honoEnhancer']>

export const enhance = function enhance(createApp: (app: Hono) => Hono) {
  return (baseApp: Hono) => {
    baseApp.use(requestId(), contextStorage(), globals())
    baseApp.route('/api', api)
    const app = createApp(baseApp)

    if (import.meta.env?.PROD) {
      return app
    }

    return {
      fetch(req: Request) {
        return cloudflareDevServerHandler(req, app)
      },
    }
  }
} as Enhancer
