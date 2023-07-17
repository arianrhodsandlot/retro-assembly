import blobToBuffer from 'blob-to-buffer'
import ky from 'ky'
import { camelCase, isEqual, pick, sortBy } from 'lodash-es'
import { parse } from 'path-browserify'
import { systemFullNameMap } from '../constants/systems'
import { parseGoodCode } from '../helpers/misc'
import { Libretrodb } from './libretrodb/libretrodb'
import { type Entry } from './libretrodb/types'

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
    const systemFullName = systemFullNameMap[this.system]

    const blob = await ky(`/vendor/databases/${systemFullName}.rdb`).blob()
    const buffer = await new Promise((resolve, reject) =>
      blobToBuffer(blob, (error, buffer) => (buffer ? resolve(buffer) : reject(error))),
    )
    const db = await Libretrodb.from(buffer, { indexHashes: false })

    const { index } = this
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

  async ready() {
    await this.readyPromise
    return this
  }

  queryByFileName(fileName: string) {
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
