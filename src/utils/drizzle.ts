import { drizzle } from 'drizzle-orm/d1'
import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'

export const createDrizzle = memoize(function createDrizzle() {
  const c = getHonoContext()
  const { DB } = env<{ DB: any }>(c, 'workerd')
  if (DB) {
    console.info('Found DB in environment, using it as our database.')
    return drizzle(DB)
  }
})
