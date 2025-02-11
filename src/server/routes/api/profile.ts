import { api } from './app.ts'

api.get('/profile', (c) => {
  const user = c.get('user')

  const response = structuredClone(user)
  response.user_metadata.provider_credentials = undefined

  return c.var.ok(response)
})
