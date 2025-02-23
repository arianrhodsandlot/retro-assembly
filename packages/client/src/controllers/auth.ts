import { createServerClient } from '@supabase/ssr'

export function auth(ctx) {
  const supabase = createServerClient('xx', 'xx', {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, options, value } of cookiesToSet) {
            cookieStore.set(name, value, options)
          }
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  })
  return () => {
    supabase.auth()
  }
}
