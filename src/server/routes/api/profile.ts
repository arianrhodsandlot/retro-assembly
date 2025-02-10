import { api } from './app.ts'

api.get('/profile', (c) => {
  const user = c.get('user')

  return c.var.ok({ user })
})
