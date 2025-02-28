import { and, eq } from 'drizzle-orm'
import { isString } from 'es-toolkit'
import { Hono } from 'hono'
import { platformMap } from '../constants/platform.ts'
import { createRom } from '../controllers/create-rom.ts'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { rom } from '../databases/library/schema.ts'
import auth from '../middlewares/hono/auth.ts'
import { nanoid } from '../utils/misc.ts'

const api = new Hono()

api.use(auth())

function isBlobs(value: unknown): value is File[] {
  return Array.isArray(value) && value.every((item) => item instanceof File)
}

api.post('v1/rom/new', async (c) => {
  // validations
  const body = await c.req.parseBody({ all: true })
  const { platform } = body
  if (!isString(platform) || !(platform in platformMap)) {
    return c.json({ message: 'invalid platform' })
  }
  const files = Array.isArray(body.files) ? body.files : [body.files]
  if (!isBlobs(files)) {
    return c.json({ message: 'invalid files' })
  }

  const storage = c.get('storage')

  const roms = await Promise.all(
    files.map(async (file) => {
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
      return rom
    }),
  )

  return c.json(roms)
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
