import type { Hono } from 'hono'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import pino from 'pino'
import type { Config } from 'waku/config'
import { cloudflareDevServer } from './cloudflare-dev-server.ts'

const cloudflareDevServerHandler = cloudflareDevServer({
  // https://developers.cloudflare.com/workers/wrangler/api/#parameters-1
  persist: {
    path: '.wrangler/state/v3',
  },
})

const pinoLogger = pino({
  transport: {
    target: 'pino-pretty',
  },
})

function log(message: string, ...rest: string[]) {
  pinoLogger.info(message, ...rest)
}

type Enhancer = NonNullable<Config['unstable_honoEnhancer']>

export const enhance = function enhance(createApp: (app: Hono) => Hono) {
  return (baseApp: Hono) => {
    baseApp.use(requestId(), logger(log))
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
