import type { Middleware } from 'waku/config'
import { getC } from '../../utils/misc.ts'
import { shouldApplyMiddlware } from './utils.ts'

export default (function authMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    const currentUser = getC('currentUser')

    const { pathname, search } = ctx.req.url
    const needAuth = pathname === '/app' || pathname.startsWith('/app/')
    if (!needAuth || currentUser) {
      return await next()
    }

    const redirectTo = `${pathname}${search}`
    const loginUrl = new URL('/login', ctx.req.url.origin)
    loginUrl.searchParams.set('redirect_to', redirectTo)
    const loginUrlPath = `${loginUrl.pathname}${loginUrl.search}`
    ctx.res.status = 302
    ctx.res.headers ??= {}
    ctx.res.headers.Location = loginUrlPath
  }
} as Middleware)
