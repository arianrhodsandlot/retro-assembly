import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { env } from 'hono/adapter'
import { setCookie } from 'hono/cookie'
import { getHonoContext } from 'waku/unstable_hono'

export function createSupabase() {
  const c = getHonoContext()
  const { SUPABASE_ANON_KEY, SUPABASE_URL } = env<{ SUPABASE_ANON_KEY: string; SUPABASE_URL: string }>(c)

  if (!SUPABASE_ANON_KEY || !SUPABASE_URL) {
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
}
