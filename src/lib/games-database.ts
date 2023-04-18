import { parse } from 'goodcodes-parser'
import { camelCase, isEqual, pick } from 'lodash-es'
import { systemFullNameMap } from './constants'

function normalizeGameName(originalName: string) {
  // workaround for https://github.com/jbdemonte/goodcodes-parser/issues/13
  let name = parse(`0 - ${originalName}`).rom
  name = camelCase(name).toLowerCase()
  return name
}

function isSimilarName(name1: string, name2: string) {
  const comparePropNames = ['contries', 'languages', 'revision', 'versions']
  const { codes: codes1 } = parse(name1)
  const { codes: codes2 } = parse(name2)
  const props1 = pick(codes1, comparePropNames)
  const props2 = pick(codes2, comparePropNames)
  return isEqual(props1, props2)
}

export class GamesDatabase {
  private static dbPromises = new Map<string, Promise<GamesDatabase>>()

  private index = new Map<string, { name: string }[]>()
  private system: string
  private readyPromise: Promise<void>
  constructor(name: string) {
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
    const { default: rows } = await import(`../generated/retroarch-databases/${systemFullName}.rdb.json`)

    const { index } = this
    for (const row of rows) {
      const key = normalizeGameName(row.name)
      if (key) {
        const candidates = index.get(key)
        if (candidates) {
          candidates.push(row)
        }
        index.set(key, [row])
      }
    }
  }

  async ready() {
    await this.readyPromise
    return this
  }

  queryByFileName(fileName) {
    const key = normalizeGameName(fileName)
    const candidates = this.index.get(key)
    if (!candidates) {
      return
    }

    if (candidates?.length > 1) {
      for (const candidate of candidates) {
        if (isSimilarName(candidate.name, fileName)) {
          return candidate
        }
      }
    }
    return candidates[0]
  }
}
