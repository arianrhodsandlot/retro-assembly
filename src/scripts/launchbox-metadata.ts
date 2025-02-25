import { createReadStream } from 'node:fs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { chunk, noop, snakeCase } from 'es-toolkit'
import sax from 'sax'
import {
  launchboxGame,
  launchboxGameAlternateName,
  launchboxPlatform,
  launchboxPlatformAlternateName,
} from '../database/schema.ts'

const xmlPath = path.resolve(import.meta.dirname, './inputs/launchbox/Metadata/Metadata.xml')

const db = drizzle({ connection: path.resolve(import.meta.dirname, './artifacts/launchbox-metadata.db') })

type Records = Record<string, string>[]

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
          recordsMap[openingTag].push(record)
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

async function writeLaunchboxPlatform(records: Records) {
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

async function writeLaunchboxPlatformAlternateName(records: Records) {
  await db.insert(launchboxPlatformAlternateName).values(
    records.map((record) => ({
      ...record,
      alternate: record.alternate,
    })),
  )
}

async function writeLaunchboxGameAlternateName(records: Records) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGameAlternateName).values(
      recordsChunk.map((record) => ({
        ...record,
        database_id: castInteger(record.database_id),
      })),
    )
  }
}

async function writeLaunchboxGame(records: Records) {
  for (const recordsChunk of chunk(records, 1000)) {
    await db.insert(launchboxGame).values(
      recordsChunk.map((record) => ({
        ...record,
        community_rating: castDecimal(record.community_rating),
        community_rating_count: castInteger(record.community_rating),
        cooperative: castBoolean(record.cooperative),
        database_id: castInteger(record.database_id) as number,
        max_players: castInteger(record.max_players),
        release_date: castDate(record.release_date),
      })),
    )
  }
}

const loadMetadataFromCache = false
const cachePathMap = {
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
    metadata.Platform = JSON.parse(await readFile(cachePathMap.Platform, 'utf8'))
    metadata.PlatformAlternateName = JSON.parse(await readFile(cachePathMap.PlatformAlternateName, 'utf8'))
    metadata.GameAlternateName = JSON.parse(await readFile(cachePathMap.GameAlternateName, 'utf8'))
    return metadata
  }
  const metadata = await parseMetadata(xmlPath)
  await Promise.all([
    writeFile(path.resolve(cachePathMap.Platform), JSON.stringify(metadata.Platform)),
    writeFile(path.resolve(cachePathMap.PlatformAlternateName), JSON.stringify(metadata.PlatformAlternateName)),
    writeFile(path.resolve(cachePathMap.GameAlternateName), JSON.stringify(metadata.GameAlternateName)),
  ])
  return metadata
}

async function main() {
  const metadata = await getMetadata()

  console.info('writing metadata.Platform...')
  await writeLaunchboxPlatform(metadata.Platform)

  console.info('writing metadata.PlatformAlternateName...')
  await writeLaunchboxPlatformAlternateName(metadata.PlatformAlternateName)

  console.info('writing metadata.GameAlternateName...')
  await writeLaunchboxGameAlternateName(metadata.GameAlternateName)

  console.info('writing metadata.Game...')
  await writeLaunchboxGame(metadata.Game)
}

await main()
