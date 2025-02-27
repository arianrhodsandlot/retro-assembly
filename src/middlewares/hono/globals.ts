import type { SupabaseClient } from '@supabase/supabase-js'
import { createMiddleware } from 'hono/factory'
import { createDrizzle } from '../../utils/drizzle.ts'
import { createStorage } from '../../utils/storage.ts'
import { createSupabase } from '../../utils/supabase.ts'

declare module 'hono' {
  interface ContextVariableMap {
    currentUser: { id: string }
    db: ReturnType<typeof createDrizzle>
    storage: ReturnType<typeof createStorage>
    supabase?: SupabaseClient
  }
}

export default (function globalsMiddleware() {
  return createMiddleware(async (c, next) => {
    const supabase = createSupabase()
    if (supabase) {
      c.set('supabase', supabase)

      // const { data } = await supabase.auth.getUser()
      // if (data?.user) {
      //   c.set('currentUser', data.user)
      // }
      c.set('currentUser', { id: '567a53eb-c109-4142-8700-00f58db9853f' })
    }

    c.set('db', createDrizzle())
    c.set('storage', createStorage())

    await next()
  })
})
