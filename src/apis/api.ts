import { Hono } from 'hono'
import { env } from 'hono/adapter'
import { customAlphabet } from 'nanoid'
import nanoidDictionary from 'nanoid-dictionary'
import auth from '../middlewares/hono/auth.ts'
import globals from '../middlewares/hono/globals.ts'

const nanoid = customAlphabet(nanoidDictionary.nolookalikes, 7)
const api = new Hono()

api.use(globals(), auth())

api.post('v1/rom/new', async (c) => {
  const db = c.get('db')
  const storage = c.get('storage')

  const { file } = await c.req.parseBody()
  const fileId = nanoid()

  const object = await storage.put(fileId, file)
  return c.json({ object })
})

api.get('v1/rom/:id/content', async (c) => {
  const db = c.get('db')
  const storage = c.get('storage')

  const rom = await db.query.rom.findFirst({ where: ({ id }, { eq }) => eq(id, c.req.param('id')) })
  if (!rom) {
    return c.body('rom not found', 404)
  }

  const fileId = rom.file_id
  const object = await storage.get(fileId)
  if (!object) {
    return c.body('file not found', 404)
  }

  const headers = new Headers()
  // this may fail when using miniflare
  try {
    object.writeHttpMetadata(headers)
  } catch {}
  headers.set('ETag', object.httpEtag)
  if (object.range && 'offset' in object.range && 'end' in object.range) {
    const contentRange = `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`
    headers.set('Content-Range', contentRange)
  }
  let status = 304
  if (object.body) {
    status = headers.get('Range') ? 206 : 200
  }
  return new Response(object.body, { headers, status })
})

export { api }
