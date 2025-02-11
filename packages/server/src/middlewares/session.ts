import type { Context, Next } from 'hono'

export function session() {
  return async (c: Context, next: Next) => {
    if (c.req.path.startsWith('/auth/')) {
      await next()
      return
    }

    const { data } = await c.var.supabase.auth.getUser()
    if (!data?.user) {
      return c.var.error('no login')
    }
    c.set('user', data.user)

    await next()
  }
}
