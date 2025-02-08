import type { Context } from 'hono'

export function roms(c: Context) {
  const platform = c.req.queries('platform')

  return c.var.ok({
    platform: { id: platform },
    roms: [],
  })
}
