import type { Context } from 'hono'
import { ok } from '../utils.ts'

export function platforms(c: Context) {
  // const platformIds = Rom.distinct('platform_id')
  // const platform = platformIds.map((platformId) => map[platformId])
  return ok(c, {
    platforms: [],
  })
}
