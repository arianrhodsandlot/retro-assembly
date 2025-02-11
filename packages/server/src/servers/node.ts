import { serve } from '@hono/node-server'
import { app } from '../app.ts'

serve(app, (info) => {
  console.info(`Listening on http://localhost:${info.port}/`)
})
