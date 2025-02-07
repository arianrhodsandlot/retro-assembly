import type { Context } from 'hono'
import { ok } from '../utils.ts'

export function roms(c: Context) {
  const platform = c.req.queries('platform')

  return ok(c, {
    platform: { id: platform },
    roms: [],
  })
}
