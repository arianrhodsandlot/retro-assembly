import { and, count, eq } from 'drizzle-orm'
import { rom } from '../databases/library/schema.ts'
import { getC } from '../utils/misc.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  launchboxGameId: number | undefined
  libretroGameId: string | undefined
  platform: string
}

export async function createRom(params: CreateRomParams) {
  const c = getC()
  const { library } = c.get('db')
  const currentUser = c.get('currentUser')

  const [countResult] = await library
    .select({ count: count() })
    .from(rom)
    .where(and(eq(rom.user_id, currentUser.id), eq(rom.file_name, params.fileName), eq(rom.platform, params.platform)))

  if (countResult.count) {
    return
  }

  const value = {
    file_id: params.fileId,
    file_name: params.fileName,
    launchbox_game_id: params.launchboxGameId,
    libretro_game_id: params.libretroGameId,
    platform: params.platform,
    user_id: currentUser.id,
  }
  const [result] = await library.insert(rom).values(value).returning()

  return result
}
