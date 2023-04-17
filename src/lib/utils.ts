import { parse } from 'goodcodes-parser'
import { camelCase, capitalize, isEqual, pick } from 'lodash-es'
import { systemFullNameMap } from './constants'
import { guessSystem } from './file'

async function getSystemDb(system) {
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    throw new Error('Invalid system:', system)
  }
  const { default: db } = await import(`../generated/retroarch-databases/${systemFullName}.rdb.json`)
  return db
}

function isSimilarEntry(entry1, entry2) {
  const comparePropNames = ['contries', 'languages', 'revision', 'versions']
  const entry1Props = pick(entry1.codes, comparePropNames)
  const entry2Props = pick(entry2.codes, comparePropNames)
  return isEqual(entry1Props, entry2Props)
}

function getCover({ system, name, type = system === 'gw' ? 'snap' : 'title' }) {
  const systemFullName = systemFullNameMap[system]
  const typeUrlPart = `Named_${capitalize(type)}s`
  return name
    ? `https://thumbnails.libretro.com/${encodeURIComponent(systemFullName)}/${encodeURIComponent(
        typeUrlPart
      )}/${encodeURIComponent(name)}.png`
    : ''
}

export async function guessGameInfo(rom) {
  const system = await guessSystem(rom)
  const db = await getSystemDb(system)

  const parsedRomName = parse(`0 - ${rom.name}`)
  const candidates: any[] = []
  for (const entry of db) {
    if (entry.name) {
      // workaround for https://github.com/jbdemonte/goodcodes-parser/issues/13
      const fileRomName = parsedRomName.rom
      const entryName = parse(`0 - ${entry.name}`).rom
      const normalizedFileRomName = camelCase(fileRomName).toLowerCase()
      const normalizedEntryName = camelCase(entryName).toLowerCase()
      if (normalizedFileRomName === normalizedEntryName) {
        candidates.push(entry)
      }
    }
  }

  let [detail] = candidates
  if (candidates.length > 1) {
    for (const entry of candidates) {
      const parsedEntryName = parse(`0 - ${entry.name}`)
      if (isSimilarEntry(parsedRomName, parsedEntryName)) {
        detail = entry
        break
      }
    }
  }

  console.log(detail)

  return {
    system,
    cover: getCover({ system, name: detail.name }),
    goodcodes: parsedRomName,
    detail,
  }
}
