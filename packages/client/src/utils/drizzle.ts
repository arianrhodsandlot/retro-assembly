import { drizzle } from 'drizzle-orm/d1'
import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'

export function createDrizzle() {
  const c = getHonoContext()
  const { DB } = env<{ DB: any }>(c, 'workerd')
  return drizzle(DB)
}
