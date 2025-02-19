import fs from 'node:fs'
import sax from 'sax'
import pkg from '@prisma/client'

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
    writeToDb()
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

async function writeToDb () {
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
