import { serve } from '@hono/node-server'
import { app } from '../app.ts'

const port = Number.parseInt(process.env.PORT ?? '', 10) || 3001
serve({ ...app, port }, (info) => {
  console.info(`Listening on http://localhost:${info.port}/`)
})
