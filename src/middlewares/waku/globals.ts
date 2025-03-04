import type { Middleware } from 'waku/config'
import { shouldApplyMiddlware } from './utils.ts'

declare module 'waku/middleware/context' {
  export function getContextData(): {
    redirect: (location: string, status?: number) => undefined
  }
}

export default (function globalsMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    function redirect(location: string, status = 302) {
      ctx.res.status = status
      ctx.res.headers ??= {}
      ctx.res.headers.location = location
    }

    ctx.data.redirect = redirect

    await next()
  }
} as Middleware)
