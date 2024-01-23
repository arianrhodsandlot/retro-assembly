import { Hono } from 'hono'

const app = new Hono()

app.get('/api/ls', (c) => c.text('Hono!'))

export default app
