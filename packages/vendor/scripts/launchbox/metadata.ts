import fs from 'node:fs'
import sax from 'sax'
import pkg from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { chunk, snakeCase } from 'es-toolkit'
import { $ } from 'zx'

const SUPABASE_URL = 'https://fzxntkrptuaveepyaczj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6eG50a3JwdHVhdmVlcHlhY3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTg3MTksImV4cCI6MjA1NDQ5NDcxOX0.B8LPoGKy25vVz-cxuZ885haLnfBekidroDRPARJyfts'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { PrismaClient }= pkg
const prisma = new PrismaClient()

const xmlPath = 'inputs/launchbox/Metadata/Metadata.xml'

const saxStream = sax.createStream(true, { trim: true })

const recordsMap: Record<string, Record<string, string>[]> = {
  Game: [],
  Platform: [],
  PlatformAlternateName: [],
  GameAlternateName: [],
}
let record: Record<string, string> = {}
let field = ''

fs.createReadStream(xmlPath).pipe(saxStream)

const openingTags: string[] = []
let isRecording = false

saxStream.on('opentag', (tag) => {
  openingTags.push(tag.name)
  field = snakeCase(tag.name).replace('md_5', 'md5').replace('crc_32', 'crc32')
  isRecording = openingTags.length > 2 && openingTags[1] in recordsMap
})

saxStream.on('text', (text) => {
  if (isRecording && field) {
    record[field] ||= ''
    record[field] += text
  }
})

saxStream.on('closetag', async (tag) => {
  const openingTag = openingTags.pop()

  if (openingTags.length === 1) {
    if (openingTag && openingTag in recordsMap) {
      recordsMap[openingTag].push(record)
    }
    record = {}
    field = ''
  }

  if (openingTags.length === 0) {
    done()
  }
})

saxStream.on('error', () => { })

function getRecordsFields (records) {
  const fields = new Set()
  records.forEach((record) => {
    Object.keys(record).forEach(key => fields.add(key))
  })
  return Array.from(fields)
}

function parseBoolean (value: string) {
  if (value === 'true') {
    return true
  }
  if (value === 'false') {
    return false
  }
}

function parseInteger (value) {
  try {
    return parseInt(value, 10) || null
  } catch {}
}

function parseDecimal (value) {
  try {
    return parseFloat(value) || null
  } catch {}
}

async function done () {
  for (const key in recordsMap) {
    if (key !== 'Game')
    fs.writeFileSync('artifacts/' + key + ".json", JSON.stringify(recordsMap[key]))
  }

  for (const platform of recordsMap.Platform) {
    const row = { ...platform, emulated: parseBoolean(platform.emulated), use_mame_files: parseBoolean(platform.use_mame_files) }
    await prisma.launchboxPlatform.create({ data: row })
  }

  for (const alternate of recordsMap.PlatformAlternateName) {
    await prisma.launchboxPlatformAlternateName.create({ data: alternate })
  }

  for (const alternate of recordsMap.GameAlternateName) {
    const row = {
      ...alternate,
      database_id: parseInteger(alternate.database_id),
    }
    await prisma.launchboxGameAlternateName.create({ data: row })
  }

  for (const game of recordsMap.Game) {
    const row = {
      ...game,
      database_id: parseInteger(game.database_id),
      max_players: parseInteger(game.max_players),
      cooperative: parseBoolean(game.cooperative),
      community_rating: parseDecimal(game.community_rating),
      community_rating_count: parseInteger(game.community_rating),
    }
    await prisma.launchboxGame.create({ data: row })
  }
}


async function writeToSupabase () {
  let i = 0

  const entries = games.map(game => ({
    ...game,
    communityrating: Number.parseFloat(game.communityrating) ?? null,
    communityratingcount: Number.parseFloat(game.communityratingcount) ?? null,
    cooperative: game.cooperative === 'true' ? true : (game.cooperative === 'false'? false: null),
    databaseid: Number.parseFloat(game.databaseid) ?? null,
    maxplayers: Number.parseFloat(game.maxplayers) ?? null,
    releaseyear: Number.parseFloat(game.releaseyear) || null,
  }))

  const entriesChunk = chunk(entries, 5000)

  for (const entries of entriesChunk) {
    i += 1
    console.log('creating:', i + '/' + entriesChunk.length)
    const { data, error } = await supabase.from('retroassembly_launchbox_game').insert(entries)
    if (error) {
      console.log(error)
      throw error
    }
  }
}
