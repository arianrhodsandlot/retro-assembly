import path from 'node:path'
import { and, eq, or } from 'drizzle-orm'
import { parse } from 'goodcodes-parser'
import { platformMap } from '../constants/platform.ts'
import { launchboxGame, libretroGame } from '../databases/metadata/schema.ts'
import { getC, restoreTitleForSorting } from '../utils/misc.ts'
import { getCompactName } from '../utils/rom.ts'

async function guessLibretroGame(fileName: string, platform: string) {
  const c = getC()
  const { metadata } = c.get('db')

  const baseName = path.parse(fileName).name

  const results = await metadata
    .select()
    .from(libretroGame)
    .where(
      and(
        or(eq(libretroGame.rom_name, fileName), eq(libretroGame.compact_name, getCompactName(baseName))),
        eq(libretroGame.platform, platformMap[platform].libretroName),
      ),
    )
    .limit(1)
  return results.at(0)
}

async function guessLaunchboxGame(fileName: string, platform: string) {
  const c = getC()
  const { metadata } = c.get('db')

  const baseName = path.parse(fileName).name
  const restoredBaseName = restoreTitleForSorting(parse(baseName).rom)
  const results = await metadata
    .select()
    .from(launchboxGame)
    .where(
      and(
        eq(launchboxGame.compact_name, getCompactName(restoredBaseName)),
        eq(launchboxGame.platform, platformMap[platform].launchboxName),
      ),
    )
    .limit(1)

  return results.at(0)
}

export async function guessGameInfo(fileName: string, platform: string) {
  const [libretro, launchbox] = await Promise.all([
    guessLibretroGame(fileName, platform),
    guessLaunchboxGame(fileName, platform),
  ])
  return { launchbox, libretro }
}
