import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { memoize } from 'es-toolkit'
import { env } from 'hono/adapter'
import { setCookie } from 'hono/cookie'
import { getC } from './misc.ts'

export const createSupabase = memoize(function createSupabase() {
  const c = getC()
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env<{ SUPABASE_ANON_KEY: string; SUPABASE_URL: string }>(c)

  if (!SUPABASE_ANON_KEY || !SUPABASE_URL) {
    console.warn('SUPABASE_ANON_KEY and SUPABASE_URL is not found in the environment. Not creating the supabase client')
    return
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header('Cookie') ?? '')
      },

      setAll(cookiesToSet) {
        for (const { name, options, value } of cookiesToSet) {
          // @ts-expect-error hono's cookie options parameter is not fully compatible with supabase's
          setCookie(c, name, value, options)
        }
      },
    },
  })
})
