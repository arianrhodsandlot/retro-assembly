import type { SupabaseClient } from '@supabase/supabase-js'
import type { Middleware } from 'waku/config'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createSupabase } from '../../utils/supabase.ts'
import { shouldApplyMiddlware } from './utils.ts'

declare module 'waku/middleware/context' {
  export function getContextData(): {
    currentUser: { id: string }
    db: ReturnType<typeof createDrizzle>
    redirect: (location: string, status?: number) => void
    supabase?: SupabaseClient
  }
}

export default (function globalsMiddleware() {
  return async (ctx, next) => {
    if (!shouldApplyMiddlware(ctx.req.url.pathname)) {
      return await next()
    }

    const supabase = createSupabase()
    if (supabase) {
      ctx.data.supabase = supabase

      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        ctx.data.currentUser = data.user
      }
    }

    ctx.data.db = createDrizzle()

    function redirect(location: string, status = 302) {
      ctx.res.status = status
      ctx.res.headers ??= {}
      ctx.res.headers.location = location
    }

    ctx.data.redirect = redirect

    await next()
  }
} as Middleware)
