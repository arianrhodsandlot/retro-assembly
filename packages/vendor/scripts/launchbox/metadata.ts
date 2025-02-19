import fs from 'node:fs'
import sax from 'sax'
import pkg from '@prisma/client'
import { createClient } from '@supabase/supabase-js'
import { chunk } from 'es-toolkit'

const SUPABASE_URL = 'https://fzxntkrptuaveepyaczj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6eG50a3JwdHVhdmVlcHlhY3pqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MTg3MTksImV4cCI6MjA1NDQ5NDcxOX0.B8LPoGKy25vVz-cxuZ885haLnfBekidroDRPARJyfts'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

const { PrismaClient }= pkg
const prisma = new PrismaClient()

const xmlPath = 'inputs/launchbox/Metadata/Metadata.xml'

const saxStream = sax.createStream()

const games: Record<string, string>[] = []

let start = false
let game: Record<string, string> = {}
let name = ''

const keys = new Set()
fs.createReadStream(xmlPath).pipe(saxStream)

saxStream.on('opentag', (tag) => {
  if (tag.name === 'GAME') {
    start = true
    return
  }

  if (tag.name === 'PLATFORM' && !start) {
    saxStream.end('')
    writeToSupabase()
  }

  if (start) {
    name = tag.name.toLowerCase()
  }
})

saxStream.on('text', (text) => {
  if (start && name) {
    game[name] ||= ''
    game[name] += text
    keys.add(name)
  }
})

saxStream.on('closetag', async (tag) => {
  if (tag === 'GAME') {
    games.push(game)
    game = {}
    start = false
  }
  name = ''
})

saxStream.on('error', () => {})

async function writeToSQLite () {
  let i = 0
  for (const game of games) {
    i += 1
    const entry = {
      ...game,
      communityrating: Number.parseFloat(game.communityrating) ?? null,
      communityratingcount: Number.parseFloat(game.communityratingcount) ?? null,
      cooperative: game.cooperative === 'true' ? true : (game.cooperative === 'false'? false: null),
      databaseid: Number.parseFloat(game.databaseid) ?? null,
      maxplayers: Number.parseFloat(game.maxplayers) ?? null,
      releaseyear: Number.parseFloat(game.releaseyear) || null,
    }
    console.log('creating:', i + '/' + games.length, game.name)
    try {
      await prisma.game.create({ data: entry })
    } catch (err) { 
      console.log('error occured while creating:', entry)
      throw err
    }
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
