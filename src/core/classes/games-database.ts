import ky from 'ky'
import { camelCase, isEqual, pick, sortBy } from 'lodash-es'
import { parse } from 'path-browserify'
import { systemFullNameMap } from '../constants/systems'
import { blobToBuffer } from '../helpers/file'
import { parseGoodCode } from '../helpers/misc'
import { Libretrodb } from './libretrodb/libretrodb'
import { type Entry } from './libretrodb/types'

const cdnHost = 'https://cdn.jsdelivr.net'
const cdnType = 'gh'
const dbRepo = 'libretro/libretro-database'
const dbVersion = 'ee672'

function getDbUrl(systemFullName: string) {
  const dbPath = `rdb/${systemFullName}.rdb`
  return `${cdnHost}/${cdnType}/${dbRepo}@${dbVersion}/${dbPath}`
}

function normalizeGameName(originalName: string) {
  let name = parseGoodCode(originalName).rom
  name = camelCase(name).toLowerCase()
  return name
}

function isSimilarName(name1: string, name2: string) {
  const comparePropNames = ['contries', 'languages', 'revision', 'versions']
  const { codes: codes1 } = parseGoodCode(name1)
  const { codes: codes2 } = parseGoodCode(name2)
  const props1 = pick(codes1, comparePropNames)
  const props2 = pick(codes2, comparePropNames)
  return isEqual(props1, props2)
}

export class GamesDatabase {
  private static dbPromises = new Map<string, Promise<GamesDatabase>>()

  private index = new Map<string, Entry<string>[]>()
  private arcadeFilenameMap: Record<string, string> = {}
  private system: string
  private readyPromise: Promise<void>
  constructor(name: string) {
    if (!name) {
      throw new Error('Invalid system name')
    }
    this.system = name
    this.readyPromise = this.load()
  }

  static async queryByFileNameFromSystem({ fileName, system }: { fileName: string; system: string }) {
    const { dbPromises } = GamesDatabase
    let dbPromise = dbPromises.get(system)
    if (!dbPromise) {
      dbPromise = new GamesDatabase(system).ready()
      dbPromises.set(system, dbPromise)
    }
    const db = await dbPromise
    return db.queryByFileName(fileName)
  }

  async load() {
    const { index, system } = this
    const systemFullName = systemFullNameMap[system]

    const dbUrl = getDbUrl(systemFullName)
    const blob = await ky(dbUrl).blob()
    const buffer = await blobToBuffer(blob)
    const db = await Libretrodb.from(buffer, { indexHashes: false })

    for (const entry of db.getEntries()) {
      if (entry.name) {
        const key = normalizeGameName(entry.name)
        if (key) {
          const candidates = index.get(key) ?? []
          candidates.push(entry)
          index.set(key, candidates)
        }
      }
    }

    if (system === 'arcade') {
      const gamelistText = await ky('https://cdn.jsdelivr.net/gh/libretro/FBNeo@0deef/gamelist.txt').text()
      const gamelist = gamelistText
        .split('\n')
        .slice(7)
        .map((row) => row.split('|').map((segment) => segment.trim()))
      const arcadeFilenameMap = {}
      for (const row of gamelist) {
        const [, filename, , fullName] = row
        if (/^(nes|md|msx|spec|gg|sms|fds|pce|cv)_/.test(filename)) {
          continue
        }
        arcadeFilenameMap[filename] = fullName
      }
      this.arcadeFilenameMap = arcadeFilenameMap
    }
  }

  async ready() {
    try {
      await this.readyPromise
    } catch (error) {
      console.warn(error)
    }
    return this
  }

  queryByFileName(fileName: string) {
    if (this.system === 'arcade') {
      const [baseFileName] = fileName.split('.')
      fileName = this.arcadeFilenameMap[baseFileName]
    }
    const key = normalizeGameName(fileName)
    const indexed = this.index.get(key)
    if (!indexed) {
      return
    }

    const candidates = sortBy(indexed, (item) => Object.keys(item).length)

    if (candidates?.length > 1) {
      for (const candidate of candidates) {
        if (candidate.name === parse(fileName).name) {
          return candidate
        }
      }
      for (const candidate of candidates) {
        if (candidate.name && isSimilarName(candidate.name, fileName)) {
          return candidate
        }
      }
    }
    return candidates[0]
  }
}
