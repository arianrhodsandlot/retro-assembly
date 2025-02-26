import { createReadStream } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { type BetterSQLite3Database, drizzle } from 'drizzle-orm/better-sqlite3'
import { chunk, noop, snakeCase } from 'es-toolkit'
import sax from 'sax'
import {
  launchboxGame,
  launchboxGameAlternateName,
  launchboxPlatform,
  launchboxPlatformAlternateName,
} from '../../database/schema.ts'

const xmlPath = path.resolve(import.meta.dirname, '../inputs/launchbox/metadata/Metadata.xml')

type Records = Record<string, string>[]

const nonSupportedPlatforms = new Set([
  'Android',
  'Apple II',
  'Apple iOS',
  'Apple Mac OS',
  'Commodore 64',
  'Commodore Amiga',
  'Microsoft Xbox',
  'Microsoft Xbox 360',
  'Microsoft Xbox One',
  'Microsoft Xbox Series X/S',
  'MS-DOS',
  'Nintendo 3DS',
  'Nintendo GameCube',
  'Nintendo Switch',
  'Nintendo Wii',
  'Nintendo Wii U',
  'Ouya',
  'Pinball',
  'Sega Dreamcast',
  'Sega Saturn',
  'Sinclair ZX Spectrum',
  'Sony Playstation 2',
  'Sony Playstation 3',
  'Sony Playstation 4',
  'Sony Playstation 5',
  'Sony Playstation Vita',
  'Sony PSP',
  'Sony PSP Minis',
  'Web Browser',
  'Windows',
  'Windows 3.X',
])
function isSupportedPlatform(platform: string) {
  return !nonSupportedPlatforms.has(platform)
}

function parseMetadata(filePath: string) {
  const { promise, resolve } = Promise.withResolvers<Record<string, Records>>()

  const recordsMap: Record<string, Record<string, string>[]> = {
    Game: [],
    GameAlternateName: [],
    Platform: [],
    PlatformAlternateName: [],
  }
  let record: Record<string, string> = {}
  let field = ''

  const openingTags: string[] = []
  let isRecording = false

  const saxStream = sax
    .createStream(true, { trim: true })
    .on('opentag', (tag) => {
      openingTags.push(tag.name)
      field = snakeCase(tag.name).replace('md_5', 'md5').replace('crc_32', 'crc32')
      isRecording = openingTags.length > 2 && openingTags[1] in recordsMap
    })
    .on('text', (text) => {
      if (isRecording && field) {
        record[field] ||= ''
        record[field] += text
      }
    })
    .on('closetag', () => {
      const openingTag = openingTags.pop()

      if (openingTags.length === 1) {
        if (openingTag && openingTag in recordsMap) {
          if (openingTag === 'Game') {
            if (isSupportedPlatform(record.platform)) {
              recordsMap[openingTag].push(record)
            }
          } else {
            recordsMap[openingTag].push(record)
          }
        }
        record = {}
        field = ''
      }

      if (openingTags.length === 0) {
        resolve(recordsMap)
      }
    })
    .on('error', noop)

  createReadStream(filePath).pipe(saxStream)

  return promise
}

function castBoolean(value: string) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
}

function castInteger(value) {
  try {
    return Number.parseInt(value, 10) || null
  } catch {}
}

function castDecimal(value) {
  try {
    return Number.parseFloat(value) || null
  } catch {}
}

function castDate(value) {
  try {
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
  } catch {}
}

function compactName(name: string) {
  return name
    .replaceAll(/[^a-z0-9 ]/gi, '')
    .toLowerCase()
    .replaceAll(/\s+/g, '')
}

async function writeLaunchboxPlatform(records: Records, db: BetterSQLite3Database) {
  await db
    .insert(launchboxPlatform)
    .values(
      records.map((record) => ({
        ...record,
        emulated: castBoolean(record.emulated),
        name: record.name,
        release_date: castDate(record.release_date),
        use_mame_files: castBoolean(record.use_mame_files),
      })),
    )
    .onConflictDoNothing()
}

async function writeLaunchboxPlatformAlternateName(records: Records, db: BetterSQLite3Database) {
  await db.insert(launchboxPlatformAlternateName).values(
    records.map((record) => ({
      ...record,
      alternate: record.alternate,
    })),
  )
}

async function writeLaunchboxGameAlternateName(records: Records, db: BetterSQLite3Database) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGameAlternateName).values(
      recordsChunk.map((record) => ({
        ...record,
        database_id: castInteger(record.database_id),
      })),
    )
  }
}

async function writeLaunchboxGame(records: Records, db: BetterSQLite3Database) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGame).values(
      recordsChunk.map((record) => ({
        ...record,
        community_rating: castDecimal(record.community_rating),
        community_rating_count: castInteger(record.community_rating_count),
        compact_name: compactName(record.name),
        cooperative: castBoolean(record.cooperative),
        database_id: castInteger(record.database_id) as number,
        max_players: castInteger(record.max_players),
        name: record.name,
        release_date: castDate(record.release_date),
      })),
    )
  }
}

const loadMetadataFromCache = false
const cachePathMap = {
  Game: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-game.json'),
  GameAlternateName: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-game-alternate-names.json'),
  Platform: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata-platforms.json'),
  PlatformAlternateName: path.resolve(
    import.meta.dirname,
    '../artifacts/launchbox-metadata-platform-alternate-names.json',
  ),
}

async function getMetadata() {
  if (loadMetadataFromCache) {
    const metadata: Record<string, Records> = {}
    metadata.Game = JSON.parse(await readFile(cachePathMap.Game, 'utf8'))
    metadata.Platform = JSON.parse(await readFile(cachePathMap.Platform, 'utf8'))
    metadata.PlatformAlternateName = JSON.parse(await readFile(cachePathMap.PlatformAlternateName, 'utf8'))
    metadata.GameAlternateName = JSON.parse(await readFile(cachePathMap.GameAlternateName, 'utf8'))
    return metadata
  }
  const metadata = await parseMetadata(xmlPath)

  const gameIdMap = new Map<string, boolean>()
  for (const game of metadata.Game) {
    gameIdMap.set(game.database_id, true)
  }
  metadata.GameAlternateName = metadata.GameAlternateName.filter((alternate) => gameIdMap.has(alternate.database_id))

  await Promise.all([
    writeFile(path.resolve(cachePathMap.Game), JSON.stringify(metadata.Game), 'utf8'),
    writeFile(path.resolve(cachePathMap.Platform), JSON.stringify(metadata.Platform), 'utf8'),
    writeFile(path.resolve(cachePathMap.PlatformAlternateName), JSON.stringify(metadata.PlatformAlternateName), 'utf8'),
    writeFile(path.resolve(cachePathMap.GameAlternateName), JSON.stringify(metadata.GameAlternateName), 'utf8'),
  ])
  return metadata
}

async function extractLaunchboxMetadata() {
  const metadata = await getMetadata()

  const db = drizzle({ connection: path.resolve(import.meta.dirname, '../artifacts/launchbox-metadata.db') })

  console.info('writing metadata.Platform...')
  await writeLaunchboxPlatform(metadata.Platform, db)

  console.info('writing metadata.PlatformAlternateName...')
  await writeLaunchboxPlatformAlternateName(metadata.PlatformAlternateName, db)

  console.info('writing metadata.GameAlternateName...')
  await writeLaunchboxGameAlternateName(metadata.GameAlternateName, db)

  console.info('writing metadata.Game...')
  await writeLaunchboxGame(metadata.Game, db)
}

await extractLaunchboxMetadata()
