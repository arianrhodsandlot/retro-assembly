import { type FileWithDirectoryAndFileHandle } from 'browser-fs-access'
import { parse } from 'goodcodes-parser'
import { capitalize } from 'lodash-es'
import { systemFullNameMap } from './constants'
import { guessSystem } from './file'
import { GamesDatabase } from './games-database'

function getCover({ system, name, type = system === 'gw' ? 'snap' : 'title' }) {
  if (!name) {
    return ''
  }
  const systemFullName = systemFullNameMap[system]
  const typeUrlPart = `Named_${capitalize(type)}s`
  return `https://thumbnails.libretro.com/${encodeURIComponent(systemFullName)}/${encodeURIComponent(
    typeUrlPart
  )}/${encodeURIComponent(name)}.png`
}

export async function guessGameInfo(rom: FileWithDirectoryAndFileHandle) {
  const system = await guessSystem(rom)
  const detail = await GamesDatabase.queryByFileNameFromSystem({ fileName: rom.name, system })

  return {
    system,
    cover: getCover({ system, name: detail?.name }),
    goodcode: parse(`0 - ${rom.name}`),
    detail,
  }
}
