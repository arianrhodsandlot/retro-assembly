import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Context, Next } from 'hono'
import { env } from 'hono/adapter'
import { setCookie } from 'hono/cookie'

declare module 'hono' {
  interface ContextVariableMap {
    supabase: SupabaseClient
  }
}

export function supabase() {
  return async (c: Context, next: Next) => {
    const { SUPABASE_ANON_KEY, SUPABASE_URL } = env(c)

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('SUPABASE_URL or SUPABASE_ANON_KEY missing!')
    }

    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return parseCookieHeader(c.req.header('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          for (const { name, options, value } of cookiesToSet) {
            // @ts-expect-error types from hono seems to be not aligned
            setCookie(c, name, value, options)
          }
        },
      },
    })

    c.set('supabase', supabase)

    await next()
  }
}
