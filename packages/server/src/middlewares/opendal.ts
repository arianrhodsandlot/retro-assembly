import type { Context, Next } from 'hono'
import { Operator } from 'opendal'
import { validateProviderToken } from '../utils/provider-token.ts'

declare module '@supabase/supabase-js' {
  interface UserMetadata {
    provider_credentials: {
      access_token: string
      refresh_token: string
    }
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    op: Operator
  }
}

export function opendal() {
  return async (c: Context, next: Next) => {
    let user = c.get('user')
    const supabase = c.get('supabase')

    if (!user.user_metadata.provider_credentials) {
      return c.redirect('/auth/login')
    }

    const { credentials, valid } = await validateProviderToken(
      user.app_metadata.provider,
      user.user_metadata.provider_credentials,
    )
    if (valid) {
      if (credentials) {
        const { data } = await supabase.auth.updateUser({ data: { provider_credentials: credentials } })
        if (data.user) {
          user = data.user
          c.set('user', user)
        }
      }
    } else {
      return c.redirect('/auth/login')
    }

    const accessToken = user.user_metadata.provider_credentials.access_token
    const op = new Operator('gdrive', { access_token: accessToken })

    c.set('op', op)

    await next()
  }
}
