import { api } from './app.ts'

api.get('/scan', (c) => {
  return c.var.ok({})
})
