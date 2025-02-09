import type { Context, Next } from 'hono'
import { Operator } from 'opendal'

declare module 'hono' {
  interface ContextVariableMap {
    op: Operator
  }
}

export function opendal() {
  return async (c: Context, next: Next) => {
    if (c.req.path.startsWith('/auth/')) {
      await next()
      return
    }

    const credentials = c.get('providerCredentials')
    const op = new Operator('gdrive', { access_token: credentials.access_token })

    c.set('op', op)

    await next()
  }
}
