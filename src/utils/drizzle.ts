import { drizzle } from 'drizzle-orm/d1'
import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getHonoContext } from 'waku/unstable_hono'
import * as schema from '../database/schema.ts'

export const createDrizzle = memoize(function createDrizzle(c = getHonoContext()) {
  const { DB } = env<{ DB: Env['DB'] }>(c, 'workerd')
  if (DB) {
    console.info('Found DB in environment, using it as our database.')
    return drizzle(DB, { schema })
  }
  throw new Error('Could not initialize drizzle')
})
