import type { Context } from 'hono'

export function roms(c: Context) {
  const platform = c.req.queries('platform')

  return ok(c, {
    platform: { id: platform },
    roms: [],
  })
}
