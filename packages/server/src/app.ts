import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { requestId } from 'hono/request-id'
import { api } from './routes/api/index.ts'

const app = new Hono()

app.use(logger(), requestId(), cors(), compress(), prettyJSON())

app.route('', api)

export { app }
