import path from 'node:path'
import { parse } from 'goodcodes-parser'
import { Libretrodb } from 'libretrodb'
import { camelCase, isEqual, pick, sortBy } from 'lodash-es'
import { platformFullNameMap } from '../constants/platform.ts'

type Entry = NonNullable<ReturnType<Libretrodb<string>['searchHash']>>

function parseGoodCode(fileName: string) {
  const goodCodeResult = parse(`0 - ${fileName}`)
  goodCodeResult.file = goodCodeResult.file.slice(4)
  return goodCodeResult
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

const databaseMap = new Map<string, { database: Libretrodb<string>; index: Map<string, Entry[]> }>()
async function getDatabase(platform: string) {
  const cached = databaseMap.get(platform)
  if (cached) {
    return cached
  }

  const platformFullName = platformFullNameMap[platform]
  const rdbPath = path.resolve(import.meta.dirname, `../assets/libretro-database/rdb/${platformFullName}.rdb`)
  const database = await Libretrodb.from(rdbPath, { indexHashes: false })

  const index = new Map<string, Entry[]>()
  for (const entry of database.getEntries()) {
    if (entry.name) {
      const key = normalizeGameName(entry.name)
      if (key) {
        const candidates = index.get(key) ?? []
        candidates.push(entry)
        index.set(key, candidates)
      }
    }
  }

  databaseMap.set(platform, { database, index })
  return { database, index }
}

export async function searchRdbRomInfo({ fileName, platform }) {
  const { index } = await getDatabase(platform)
  const key = normalizeGameName(fileName)
  const indexed = index.get(key)
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
