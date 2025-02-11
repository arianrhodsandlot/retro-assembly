import { google } from 'googleapis'
import type { Context, Next } from 'hono'
import { Operator } from 'opendal'

declare module 'hono' {
  interface ContextVariableMap {
    op: Operator
  }
}

export function opendal() {
  return async (c: Context, next: Next) => {
    const user = c.get('user')
    let providerCredentials = user.user_metadata.provider_credentials

    if (!providerCredentials) {
      return c.redirect('/auth/login')
    }

    try {
      const oauth2 = new google.auth.OAuth2()
      oauth2.credentials = providerCredentials
      await oauth2.getTokenInfo(providerCredentials.access_token)
    } catch (error) {
      if (error?.message === 'invalid_token') {
        const oauth2 = new google.auth.OAuth2({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        })
        oauth2.credentials = providerCredentials
        try {
          const response = await oauth2.refreshAccessToken()
          providerCredentials = {
            access_token: response.credentials.access_token,
            refresh_token: response.credentials.refresh_token,
          }
          await c.var.supabase.auth.updateUser({ data: { provider_credentials: providerCredentials } })
        } catch {
          return c.redirect('/auth/login')
        }
      }
    }

    const op = new Operator('gdrive', { access_token: providerCredentials.access_token })

    c.set('op', op)

    await next()
  }
}
