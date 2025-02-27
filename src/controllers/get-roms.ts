import { and, eq, inArray, type InferSelectModel } from 'drizzle-orm'
import { compact, keyBy } from 'es-toolkit'
import { rom } from '../databases/library/schema.ts'
import { launchboxGame, libretroGame } from '../databases/metadata/schema.ts'
import { getC } from '../utils/misc.ts'

export async function getRoms({ id, platform }: { id?: string; platform?: string } = {}) {
  const c = getC()
  const currentUser = c.get('currentUser')
  const { library, metadata } = c.get('db')

  const conditions = [eq(rom.user_id, currentUser.id)]
  if (id) {
    conditions.push(eq(rom.id, id))
  }
  if (platform) {
    conditions.push(eq(rom.platform, platform))
  }
  const where = and(...conditions)
  const romResults = await library.select().from(rom).where(where)

  const launchboxGameIds = compact(romResults.map((romResult) => romResult.launchbox_game_id))
  const launchboxResults = await metadata
    .select()
    .from(launchboxGame)
    .where(inArray(launchboxGame.database_id, launchboxGameIds))
  const launchboxResultMap = keyBy(launchboxResults, (launchboxResult) => launchboxResult.database_id)

  const libretroGameIds = compact(romResults.map((romResult) => romResult.libretro_game_id))
  const libretroResults = await metadata.select().from(libretroGame).where(inArray(libretroGame.id, libretroGameIds))
  const libretroResultMap = keyBy(libretroResults, (libretroResult) => libretroResult.id)

  const results = romResults.map((romResult) => ({
    ...romResult,
    launchboxGame: null as InferSelectModel<typeof launchboxGame> | null,
    libretroGame: null as InferSelectModel<typeof libretroGame> | null,
  }))

  for (const result of results) {
    if (result.libretro_game_id) {
      result.libretroGame = libretroResultMap[result.libretro_game_id]
    }
    if (result.launchbox_game_id) {
      result.launchboxGame = launchboxResultMap[result.launchbox_game_id]
    }
  }

  return results
}
