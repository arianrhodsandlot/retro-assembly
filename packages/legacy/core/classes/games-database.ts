import { camelCase, isEqual, pick, sortBy } from 'lodash-es'
import { fbneoInfo, getCDNHost, libretroDatabaseInfo } from '../constants/dependencies'
import { platformFullNameMap } from '../constants/platforms'
import { blobToBuffer } from '../helpers/file'
import { http } from '../helpers/http'
import { parseGoodCode } from '../helpers/misc'
import { path } from '../helpers/vendors'
import { Libretrodb } from './libretrodb/libretrodb'
import type { Entry } from './libretrodb/types'

const arcadeGameListUrl = `${getCDNHost()}/gh/${fbneoInfo.name}@${fbneoInfo.version}/gamelist.txt`

function getDbUrl(platformFullName: string) {
  const dbPath = `rdb/${platformFullName}.rdb`
  return `${getCDNHost()}/gh/${libretroDatabaseInfo.name}@${libretroDatabaseInfo.version}/${dbPath}`
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

const requestMap = new Map()
function requestWithoutDuplicates(url) {
  const request = requestMap.get(url) ?? http(url)
  requestMap.set(url, request)
  return request
}

export interface ArcadeGameInfo {
  company: string
  fileName: string
  fullName: string
  hardware: string
  parent: string
  year: string
}

export class GamesDatabase {
  private static gamesDatabaseMap = new Map<string, GamesDatabase>()

  private arcadeFileNameMap: Record<string, ArcadeGameInfo> = {}
  private index = new Map<string, Entry<string>[]>()
  private platform: string
  private readyPromise: Promise<void>

  constructor(name: string) {
    if (!name) {
      throw new Error('Invalid platform name')
    }
    this.platform = name
    this.readyPromise = this.load()
  }

  static getInstance(platform: string) {
    const gamesDatabase = GamesDatabase.gamesDatabaseMap.get(platform) ?? new GamesDatabase(platform)
    GamesDatabase.gamesDatabaseMap.set(platform, gamesDatabase)
    return gamesDatabase
  }

  static async queryArcadeGameInfo(fileName: string) {
    const platform = 'arcade'
    const db = GamesDatabase.getInstance(platform)
    await db.ready()
    return db.queryArcadeGameInfo(fileName)
  }

  static async queryByFileNameFromPlatform({ fileName, platform }: { fileName: string; platform: string }) {
    const db = GamesDatabase.getInstance(platform)
    await db.ready()
    return db.queryByFileName(fileName)
  }

  async load() {
    await Promise.all([this.loadRdb(), this.loadArcadeGameList()])
  }

  async loadArcadeGameList() {
    if (this.platform !== 'arcade') {
      return
    }

    const gamelistText = await http(arcadeGameListUrl).text()
    const disabledRomPrefix = /^(?:nes|md|msx|spec|gg|sms|fds|pce|cv)_/
    const gamelist = gamelistText
      .split('\n')
      .slice(7)
      .map((row) => row.split('|').map((segment) => segment.trim()))
    const arcadeFileNameMap = {}
    for (const row of gamelist) {
      const [, fileName, , fullName, parent, year, company, hardware] = row
      if (disabledRomPrefix.test(fileName)) {
        continue
      }
      arcadeFileNameMap[fileName] = { company, fileName, fullName, hardware, parent, year }
    }
    this.arcadeFileNameMap = arcadeFileNameMap
  }

  async loadRdb() {
    const { index, platform } = this
    const platformFullName = platformFullNameMap[platform]

    const dbUrl = getDbUrl(platformFullName)
    const blob = await requestWithoutDuplicates(dbUrl).blob()
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
  }

  queryArcadeGameInfo(fileName: string) {
    if (this.platform === 'arcade') {
      const [baseFileName] = fileName.split('.')
      return this.arcadeFileNameMap[baseFileName]
    }
  }

  queryByFileName(fileName: string) {
    const arcadeGameInfo = this.queryArcadeGameInfo(fileName)
    const key = normalizeGameName(arcadeGameInfo ? arcadeGameInfo.fileName : fileName)
    const indexed = this.index.get(key)
    if (!indexed) {
      return
    }

    const candidates = sortBy(indexed, (item) => Object.keys(item).length)

    if (candidates?.length > 1) {
      for (const candidate of candidates) {
        if (candidate.name === path.parse(fileName).name) {
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

  async ready() {
    try {
      await this.readyPromise
    } catch (error) {
      console.warn(error)
    }
    return this
  }
}
