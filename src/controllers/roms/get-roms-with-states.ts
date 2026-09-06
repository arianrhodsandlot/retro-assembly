import { and, count, countDistinct, desc, eq, gte, inArray, max } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { favoriteTable, romTable, stateTable, statusEnum } from '#@/databases/schema.ts'

export async function getRomsWithStates({ page = 1, pageSize = 20 } = {}) {
  const { currentUser, db, effectiveLibraryUserId, preference } = getContext().var
  const { library } = db

  const offset = (page - 1) * pageSize

  const romsRaw = await library
    .select({
      createdAt: romTable.createdAt,
      fileId: romTable.fileId,
      fileName: romTable.fileName,
      gameBoxartFileIds: romTable.gameBoxartFileIds,
      gameName: romTable.gameName,
      id: romTable.id,
      isFavorite: favoriteTable.id,
      launchboxGameId: romTable.launchboxGameId,
      libretroGameId: romTable.libretroGameId,
      platform: romTable.platform,
      rawGameMetadata: romTable.rawGameMetadata,
    })
    .from(romTable)
    .leftJoin(stateTable, and(eq(stateTable.romId, romTable.id), eq(stateTable.status, statusEnum.normal)))
    .leftJoin(
      favoriteTable,
      and(
        eq(favoriteTable.romId, romTable.id),
        eq(favoriteTable.userId, currentUser.id),
        eq(favoriteTable.status, statusEnum.normal),
      ),
    )
    .where(
      and(
        eq(romTable.userId, effectiveLibraryUserId),
        eq(romTable.status, statusEnum.normal),
        inArray(romTable.platform, preference.ui.platforms),
      ),
    )
    .groupBy(
      romTable.id,
      romTable.fileName,
      romTable.gameBoxartFileIds,
      romTable.gameName,
      romTable.launchboxGameId,
      romTable.libretroGameId,
      romTable.platform,
      favoriteTable.id,
    )
    .having(gte(count(stateTable.id), 1))
    .orderBy(desc(max(stateTable.createdAt)))
    .offset(offset)
    .limit(pageSize)

  const roms = romsRaw.map(({ isFavorite, ...rom }) => Object.assign(rom, { isFavorite: Boolean(isFavorite) }))

  const where = and(
    eq(romTable.userId, effectiveLibraryUserId),
    eq(romTable.status, statusEnum.normal),
    inArray(romTable.platform, preference.ui.platforms),
  )
  const res = await library
    .select({ total: countDistinct(romTable.id) })
    .from(romTable)
    .leftJoin(stateTable, and(eq(stateTable.romId, romTable.id), eq(stateTable.status, statusEnum.normal)))
    .where(where)
    .groupBy(romTable.id)
    .having(gte(count(stateTable.id), 1))
  const total = res[0]?.total || 0
  const pagination = { current: page, pages: Math.ceil(total / pageSize), size: pageSize, total }
  return { pagination, roms }
}
