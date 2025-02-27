import path from 'node:path'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { chunk } from 'es-toolkit'
import { Libretrodb } from 'libretrodb'
import { globby } from 'zx'
import { libretroGame } from '../../databases/metadata/schema.ts'

const nonSupportedPlatforms = new Set([
  'Commodore - Amiga',
  'DOS',
  'Microsoft - Xbox',
  'Mobile - J2ME',
  'Nintendo - GameCube',
  'Nintendo - Wii',
  'Nintendo - Wii (Digital)',
  'RPG Maker',
  'Sega - Dreamcast',
  'Sega - Naomi',
  'Sega - Naomi 2',
  'Sega - Saturn',
  'Sinclair - ZX Spectrum',
  'Sony - PlayStation 2',
  'Sony - PlayStation 3',
  'Sony - PlayStation 3 (PSN)',
  'Sony - PlayStation Portable',
  'Sony - PlayStation Portable (PSN)',
  'Sony - PlayStation Vita',
  'WASM-4',
])

function getCompactName(name: string) {
  return name
    .replaceAll(/[^a-z0-9 ]/gi, '')
    .toLowerCase()
    .replaceAll(/\s+/g, '')
}

async function extractLibretroDb(rdbPath: string, db: BetterSQLite3Database) {
  const platform = path.parse(rdbPath).name
  const libretrodb = await Libretrodb.from(rdbPath, { indexHashes: false })
  const entries = libretrodb.getEntries()

  for (const recordsChunk of chunk(entries, 1000)) {
    await db.insert(libretroGame).values(
      recordsChunk
        .filter(({ name }) => name)
        .map((record) => ({
          ...record,
          compact_name: getCompactName(`${record.name}`),
          platform,
        })),
    )
  }
}

async function extractLibretroDbs() {
  const db = drizzle({ connection: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata.db') })
  const libretroDbDirectory = path.resolve(import.meta.dirname, '../inputs/libretro/database-rdb/')
  const rdbPaths = await globby(libretroDbDirectory)
  for (const rdbPath of rdbPaths) {
    const platform = path.parse(rdbPath).name
    if (!nonSupportedPlatforms.has(platform)) {
      extractLibretroDb(rdbPath, db)
    }
  }
}

await extractLibretroDbs()
