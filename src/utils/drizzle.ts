import { drizzle } from 'drizzle-orm/d1'
import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import * as librarySchema from '../databases/library/schema.ts'
import * as metadataSchema from '../databases/metadata/schema.ts'
import { getC } from './misc.ts'

export const createDrizzle = memoize(function createDrizzle() {
  const { DB_LIBRARY, DB_METADATA } = env<Env>(getC(), 'workerd')
  if (DB_LIBRARY && DB_METADATA) {
    console.info('Found DB_LIBRARY and DB_METADATA in environment, using it as our database.')
    return {
      library: drizzle(DB_LIBRARY, { schema: librarySchema }),
      metadata: drizzle(DB_LIBRARY, { schema: metadataSchema }),
    }
  }
  throw new Error('Could not initialize drizzle')
})
