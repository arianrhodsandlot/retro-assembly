import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { platforms } from './handlers/platforms.ts'
import { profile } from './handlers/profile.ts'
import { roms } from './handlers/roms.ts'
import { scan } from './handlers/scan.ts'
import { states } from './handlers/states.ts'
import { supabaseMiddleware } from './middlewares/auth.ts'

const app = new Hono()

app.use(logger(), requestId(), cors(), compress(), supabaseMiddleware())

app.get('/api/profile', profile)
app.get('/api/platforms', platforms)
app.get('/api/roms', roms)
app.get('/api/states', states)
app.get('/api/scan', scan)

app.get('/auth/login', async (c) => {
  const supabase = c.get('supabase')
  const { data } = await supabase.auth.signInWithOAuth({
    options: {
      queryParams: {},
      redirectTo: new URL('/auth/callback', c.req.url).href,
      scopes: 'https://www.googleapis.com/auth/drive.appdata',
    },
    provider: 'google',
  })
  return c.redirect(data.url)
})

app.get('/auth/callback', async (c) => {
  const supabase = c.get('supabase')
  const code = c.req.query('code')
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    return c.json({ code, data, error })
  }
})

export { app }
