import { Hono } from 'hono'
import auth from '../middlewares/hono/auth.ts'

const app = new Hono().basePath('v1')

app.use(auth())

export { app }
