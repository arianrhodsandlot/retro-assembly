import type { Context, Next } from 'hono'
import { CloudFS } from '../classes/cloud-fs.ts'

declare module 'hono' {
  interface ContextVariableMap {
    fs: CloudFS
  }
}

export function fs() {
  return async (c: Context, next: Next) => {
    const credentials = c.get('providerCredentials')
    const cloudFS = new CloudFS({ credentials })

    c.set('fs', cloudFS)

    await next()
  }
}
