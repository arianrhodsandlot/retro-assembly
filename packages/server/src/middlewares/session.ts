import type { User } from '@supabase/supabase-js'
import type { Context, Next } from 'hono'

declare module 'hono' {
  interface ContextVariableMap {
    providerCredentials: {
      access_token: string
      refresh_token: string
    }
    user: User
  }
}

export function session() {
  return async (c: Context, next: Next) => {
    if (c.req.path.startsWith('/auth/')) {
      await next()
      return
    }

    const { data } = await c.var.supabase.auth.getUser()
    if (!data?.user) {
      return c.redirect('/auth/login')
    }
    c.set('user', data.user)

    await next()
  }
}
