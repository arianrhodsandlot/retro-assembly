import { app as api } from '@retroassembly/server'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.route('/api/v1/', api)

export const dynamic = 'force-dynamic'
export const GET = handle(app)
