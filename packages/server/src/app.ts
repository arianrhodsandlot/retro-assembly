import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
// eslint-disable-next-line import-x/no-useless-path-segments
import { api } from './routes/api/index.ts'
// eslint-disable-next-line import-x/no-useless-path-segments
import { auth } from './routes/auth/index.ts'

const app = new Hono()

app.use(logger(), requestId(), cors(), compress(), prettyJSON({ query: '' }))

app.route('/api', api)
app.route('/auth', auth)

export { app }
