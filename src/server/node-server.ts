import { serve } from '@hono/node-server'
import { app } from './app.ts'

serve(app)
