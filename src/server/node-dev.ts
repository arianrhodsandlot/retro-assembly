import { Hono } from 'hono'
import { RouterContextProvider, createRequestHandler } from 'react-router'
import { getAuthMode } from '#@/utils/server/auth.ts'
import app from './app.ts'

getAuthMode()

const pages = new Hono()

pages.all('*', async (c) => {
  const build = await import('virtual:react-router/server-build')
  const requestHandler = createRequestHandler(build, 'development')
  return requestHandler(c.req.raw, new RouterContextProvider())
})

if (app.router.name === 'SmartRouter') {
  app.route('', pages)
}

export { default } from './app.ts'
