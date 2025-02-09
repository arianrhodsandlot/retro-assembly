import type { Context } from 'hono'

export function profile(c: Context) {
  const user = c.get('user')

  return c.var.ok({ user })
}
