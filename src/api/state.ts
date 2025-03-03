import { and, eq } from 'drizzle-orm'
import { rom, state } from '../databases/library/schema.ts'
import { nanoid } from '../utils/misc.ts'
import { app } from './app.ts'

app.get('states', async (c) => {
  const romId = c.req.query('rom_id')
  const type = c.req.query('type')
  const db = c.get('db')
  const currentUser = c.get('currentUser')

  const conditions = [eq(state.user_id, currentUser.id), eq(state.status, 1)]
  if (romId) {
    conditions.push(eq(state.rom_id, romId))
  }
  if (type === 'auto' || type === 'manual') {
    conditions.push(eq(state.type, type))
  }
  const where = and(...conditions)
  const results = await db.library.select().from(state).where(where)
  return c.json(results)
})

app.post('state/new', async (c) => {
  const { core, rom_id: romId, state: stateFile, thumbnail, type } = await c.req.parseBody()
  if (!(stateFile instanceof Blob)) {
    return c.json({ message: 'invalid state' })
  }
  if (!(thumbnail instanceof Blob)) {
    return c.json({ message: 'invalid thumbnail' })
  }
  if (!core || typeof core !== 'string') {
    return c.json({ message: 'invalid core' })
  }
  if (!romId || typeof romId !== 'string') {
    return c.json({ message: 'invalid rom_id' })
  }
  if (!type || typeof type !== 'string' || (type !== 'auto' && type !== 'manual')) {
    return c.json({ message: 'invalid type' })
  }

  const db = c.get('db')
  const currentUser = c.get('currentUser')

  const [romResult] = await db.library
    .select()
    .from(rom)
    .where(and(eq(rom.id, romId), eq(rom.user_id, currentUser.id)))
    .limit(1)
  if (!romResult) {
    return c.json({ message: 'rom not found' })
  }

  const storage = c.get('storage')
  const stateFileId = nanoid()
  await storage.put(stateFileId, stateFile)
  const thumbnailFileId = nanoid()
  await storage.put(thumbnailFileId, thumbnail)
  const [result] = await db.library
    .insert(state)
    .values({
      core,
      file_id: stateFileId,
      platform: romResult.platform,
      rom_id: romResult.id,
      thumbnail_file_id: thumbnailFileId,
      type,
      user_id: currentUser.id,
    })
    .returning()
  return c.json(result)
})
