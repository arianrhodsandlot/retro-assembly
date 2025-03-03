import { and, eq } from 'drizzle-orm'
import { isString } from 'es-toolkit'
import { platformMap } from '../constants/platform.ts'
import { createRom } from '../controllers/create-rom.ts'
import { guessGameInfo } from '../controllers/guess-game-info.ts'
import { rom } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'
import { app } from './app.ts'
import { getFileResponse } from './utils/storage.ts'

function isBlobs(value: unknown): value is File[] {
  return Array.isArray(value) && value.every((item) => item instanceof File)
}

app.post('rom/new', async (c) => {
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

app.get('rom/:id/content', async (c) => {
  const db = c.get('db')
  const currentUser = c.get('currentUser')

  const [result] = await db.library
    .select()
    .from(rom)
    .where(and(eq(rom.id, c.req.param('id')), eq(rom.user_id, currentUser.id)))
    .limit(1)
  if (!result) {
    return c.body('rom not found', 404)
  }

  return getFileResponse(result.file_id)
})
