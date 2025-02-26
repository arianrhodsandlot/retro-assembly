import type { Hono } from 'hono'
import type { BlankEnv, BlankSchema } from 'hono/types'
import { WebSocketPair } from 'miniflare'
import { getPlatformProxy } from 'wrangler'

export function cloudflareDevServer(cfOptions: Record<string, unknown>) {
  const wranglerPromise = getPlatformProxy(cfOptions)

  return async (req: Request, app: Hono<BlankEnv, BlankSchema>) => {
    const proxy = await wranglerPromise
    Object.assign(req, { cf: proxy.cf })
    Object.assign(globalThis, {
      caches: proxy.caches,
      WebSocketPair,
    })
    return app.fetch(req, proxy.env, proxy.ctx)
  }
}
