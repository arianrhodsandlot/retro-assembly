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

export function supabaseMiddleware() {
  return async (c: Context, next: Next) => {
    const supabaseEnv = env<{
      SUPABASE_ANON_KEY: string
      SUPABASE_URL: string
    }>(c)
    const supabaseUrl = supabaseEnv.SUPABASE_URL
    const supabaseAnonKey = supabaseEnv.SUPABASE_ANON_KEY

    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL missing!')
    }

    if (!supabaseAnonKey) {
      throw new Error('SUPABASE_ANON_KEY missing!')
    }

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return parseCookieHeader(c.req.header('Cookie') ?? '')
        },
        setAll(cookiesToSet) {
          console.info('cookiesToSet', cookiesToSet)
          for (const { name, options, value } of cookiesToSet) {
            setCookie(c, name, value, options)
          }
        },
      },
    })

    c.set('supabase', supabase)

    await next()
  }
}
