import { and, eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { createRom } from '../controllers/create-rom.ts'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { rom } from '../databases/library/schema.ts'
import auth from '../middlewares/hono/auth.ts'
import { nanoid } from '../utils/misc.ts'

const api = new Hono()

api.use(auth())

api.post('v1/rom/new', async (c) => {
  const storage = c.get('storage')
  const platform = 'nes'

  const { file } = await c.req.parseBody()
  if (typeof file === 'string') {
    return c.json({})
  }

  const { launchbox, libretro } = await guessGameInfo(file.name, platform)
  const fileId = nanoid()
  await storage.put(fileId, file)
  const rom = await createRom({
    fileId,
    fileName: file.name,
    launchboxGameId: launchbox?.database_id,
    libretroGameId: libretro?.id,
    platform,
  })

  return c.json(rom)
})

api.get('v1/rom/:id/content', async (c) => {
  const db = c.get('db')
  const storage = c.get('storage')
  const currentUser = c.get('currentUser')

  const [result] = await db.library
    .select()
    .from(rom)
    .where(and(eq(rom.id, c.req.param('id')), eq(rom.user_id, currentUser.id)))
    .limit(1)
  if (!result) {
    return c.body('rom not found', 404)
  }

  const object = await storage.get(result.file_id)
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
