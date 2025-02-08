import type { Context } from 'hono'

export async function authLogin(c: Context) {
  const supabase = c.get('supabase')

  const scopes = ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file']
  const { data } = await supabase.auth.signInWithOAuth({
    options: {
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
      redirectTo: new URL('/auth/callback', c.req.url).href,
      scopes: scopes.join(' '),
    },
    provider: 'google',
  })
  return c.redirect(data.url)
}

export async function authCallback(c: Context) {
  const supabase = c.get('supabase')
  const code = c.req.query('code')
  const redirect = c.req.query('redirect') || '/api/profile'
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      c.redirect('/auth/login')
    }

    const credentials = {
      access_token: data.session.provider_token,
      refresh_token: data.session.provider_refresh_token,
    }
    await supabase.auth.updateUser({ data: { provider_credentials: credentials } })

    return c.redirect(redirect)
  }
  c.redirect('/auth/login')
}
