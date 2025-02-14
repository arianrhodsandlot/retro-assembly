import type { Provider } from '@supabase/supabase-js'
import { auth } from './app.ts'

auth.get('login', async (c) => {
  const supabase = c.get('supabase')
  const redirectTo = c.req.query('redirect_to')
  const provider = c.req.query('provider') as Provider

  if (!provider) {
    return c.var.error('invalid provider')
  }

  const scopes = {
    google: ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file'].join(' '),
  }[provider as string]

  const queryParams = {
    google: { access_type: 'offline', prompt: 'consent' },
  }[provider as string]

  const { data } = await supabase.auth.signInWithOAuth({
    options: { queryParams, redirectTo, scopes },
    provider,
  })

  return c.json(data)
})

auth.get('callback', async (c) => {
  const supabase = c.get('supabase')
  const code = c.req.query('code')

  if (!code) {
    return c.var.error('invalid code')
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    return c.var.error(error)
  }

  const credentials = {
    access_token: data.session.provider_token,
    refresh_token: data.session.provider_refresh_token,
  }
  await supabase.auth.updateUser({ data: { provider_credentials: credentials } })

  return c.json(credentials)
})
