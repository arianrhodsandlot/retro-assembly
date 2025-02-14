import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { camelCase, isEqual, pick, sortBy } from 'es-toolkit'
import { parse } from 'goodcodes-parser'
import { Libretrodb } from 'libretrodb'
import { platformFullNameMap } from '../constants/platform.ts'

/**
 * @example
 * ```
 * // an NES game record
 * {
 *   name: 'Yongzhe Dou Elong IV (Dragon Quest IV) (China) (Pirate) (Alt)',
 *   description: 'Yongzhe Dou Elong IV (Dragon Quest IV) (China) (Pirate) (Alt)',
 *   rom_name: 'Yongzhe Dou Elong IV (Dragon Quest IV) (China) (Pirate) (Alt).nes',
 *   size: 262160,
 *   crc: '497de6d9',
 *   md5: 'd7416940c69b90025a307a6e48c1d601',
 *   sha1: '1e2aa6d2e3e9d54641f8ded8f40fc75b38bd048a'
 * }
 * // an arcade game record
 * {
 *   name: 'X-Men vs Street Fighter (961004 USA)',
 *   rom_name: 'xmvsfur1.zip',
 *   size: 624109,
 *   publisher: 'Capcom',
 *   crc: 'e6c1c82d',
 *   md5: 'ad5ecb98cb02b18fc1b1929638211e3f',
 *   sha1: '47e93c46482eaa46762a695881dae2dc8f9e041c'
 * }
 * ```
 */
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
  const comparePropNames = ['countries', 'languages', 'revision', 'version'] as const
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
  const dirname = import.meta.dirname || path.parse(fileURLToPath(import.meta.url.replace('client/packages/', ''))).dir
  const rdbPath = path.resolve(dirname, `../assets/libretro-database/rdb/${platformFullName}.rdb`)
  const database = await Libretrodb.from(rdbPath, { indexHashes: false })

  const index = new Map<string, Entry[]>()
  for (const entry of database.getEntries()) {
    if (entry.name) {
      const keys = [normalizeGameName(entry.name)]
      if (platform === 'arcade') {
        keys.push(normalizeGameName(entry.rom_name))
      }
      for (const key of keys) {
        if (key) {
          const candidates = index.get(key) ?? []
          candidates.push(entry)
          index.set(key, candidates)
        }
      }
    }
  }

  databaseMap.set(platform, { database, index })
  return { database, index }
}

export async function searchRdbRomInfo({ fileName, platform }) {
  const { index } = await getDatabase(platform)
  const key = normalizeGameName(fileName)
  let candidates = index.get(key)
  if (!candidates) {
    return
  }
  candidates = sortBy(candidates, [(item) => Object.keys(item).length])

  if (candidates.length > 1) {
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
