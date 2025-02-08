import { google } from 'googleapis'
import type { Context, Next } from 'hono'

declare module 'hono' {
  interface ContextVariableMap {
    providerCredentials: {
      access_token: string
      refresh_token: string
    }
  }
}

export function session() {
  return async (c: Context, next: Next) => {
    if (c.req.routePath.startsWith('/auth/')) {
      await next()
      return
    }

    const { data } = await c.var.supabase.auth.getUser()
    const providerCredentials = data.user?.user_metadata.provider_credentials

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
          const credentials = {
            access_token: response.credentials.access_token,
            refresh_token: response.credentials.refresh_token,
          }
          await c.var.supabase.auth.updateUser({ data: { provider_credentials: credentials } })
        } catch {
          return c.redirect('/auth/login')
        }
      }
    }

    c.set('providerCredentials', data.user.user_metadata.provider_credentials)

    await next()
  }
}
