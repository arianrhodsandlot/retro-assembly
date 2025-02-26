import { createMiddleware } from 'hono/factory'

export default (function authMiddleware() {
  return createMiddleware(async (c, next) => {
    if (c.get('currentUser')) {
      return await next()
    }
    return c.json({}, 400)
  })
})
