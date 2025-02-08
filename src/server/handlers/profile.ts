import type { Context } from 'hono'

export function profile(c: Context) {
  const session = c.get('session')

  return c.var.ok({ session })
}
