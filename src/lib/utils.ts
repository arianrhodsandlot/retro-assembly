import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { parse } from 'goodcodes-parser'
import { camelCase, isEqual, pick } from 'lodash-es'

export function getGameSystem(file: FileWithDirectoryAndFileHandle) {
  if (file.webkitRelativePath.includes('nes')) {
    return 'nes'
  }
  if (file.webkitRelativePath.includes('n64')) {
    return 'n64'
  }
  if (file.webkitRelativePath.includes('gba')) {
    return 'gba'
  }
  if (file.webkitRelativePath.includes('gbc')) {
    return 'gbc'
  }
  if (file.webkitRelativePath.includes('gb')) {
    return 'gb'
  }
  if (file.webkitRelativePath.includes('megadrive')) {
    return 'megadrive'
  }
}

const systemFullNameMap = {
    gb: 'Nintendo - GameBoy',
    gba: 'Nintendo - GameBoy Advance',
    n64: 'Nintendo - Nintendo 64',
    nes: 'Nintendo - Nintendo Entertainment System',
    snes: 'Nintendo - Super Nintendo Entertainment System',
    vb: 'Nintendo - Virtual Boy',
    gamegear: 'Sega - Game Gear',
    sms: 'Sega - Master System - Mark III',
    megadrive: 'Sega - Mega Drive - Genesis',
    psx: 'Sony - PlayStation',
}

async function getSystemDb(system) {
  const systemFullName = systemFullNameMap[system]
  if (!systemFullName) {
    throw new Error('Invalid system:', system)
  }
  const { default: db } = await import(`./generated/retroarch-databases/${systemFullName}.rdb.json`
  )
  return db
}

function isSimilarEntry(entry1, entry2) {
  const comparePropNames = ['contries', 'languages', 'revision', 'versions']
  const entry1Props = pick(entry1.codes, comparePropNames)
  const entry2Props = pick(entry2.codes, comparePropNames)
  return isEqual(entry1Props, entry2Props)
}

export async function guessGameInfo(rom) {
  const system = getGameSystem(rom)
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

  if (candidates.length > 1) {
    for (const entry of candidates) {
      const parsedEntryName = parse(`0 - ${entry.name}`)
      if (isSimilarEntry(parsedRomName, parsedEntryName)) {
        return { goodcodes: parsedRomName, detail: entry }
      }
    }
  }

  return { goodcodes: parsedRomName, detail: candidates[0] }
}
