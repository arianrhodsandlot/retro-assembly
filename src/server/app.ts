import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import { authCallback, authLogin } from './handlers/auth.ts'
import { platforms } from './handlers/platforms.ts'
import { profile } from './handlers/profile.ts'
import { roms } from './handlers/roms.ts'
import { scan } from './handlers/scan.ts'
import { states } from './handlers/states.ts'
import { fs } from './middlewares/fs.ts'
import { okError } from './middlewares/ok-error.ts'
import { opendal } from './middlewares/opendal.ts'
import { session } from './middlewares/session.ts'
import { supabase } from './middlewares/supabase.ts'

const app = new Hono()

app.use(
  logger(),
  requestId(),
  cors(),
  compress(),
  prettyJSON({ query: '' }),
  okError(),
  supabase(),
  session(),
  fs(),
  opendal(),
)

app.get('/api/profile', profile)
app.get('/api/platforms', platforms)
app.get('/api/roms', roms)
app.get('/api/states', states)
app.get('/api/scan', scan)
app.get('/auth/login', authLogin)
app.get('/auth/callback', authCallback)

export { app }
