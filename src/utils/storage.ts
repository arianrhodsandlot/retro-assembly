import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { getC } from './misc.ts'

export const createStorage = memoize(function createStorage() {
  const { BUCKET } = env<{ BUCKET: Env['BUCKET'] }>(getC(), 'workerd')
  if (BUCKET) {
    return BUCKET
  }
  throw new Error('Could not initialize drizzle')
})
