import { capitalize } from 'es-toolkit'
import { platformMap } from '@/constants/platform'

function encodeRFC3986URIComponent(str: string) {
  return encodeURIComponent(str).replaceAll(/[!'()*]/g, (c) => `%${c.codePointAt(0)?.toString(16).toUpperCase()}`)
}

export function getRomCover(rom, type = 'boxart') {
  const name = rom.libretro_rdb?.name
  if (!name || !rom.platform) {
    return ''
  }
  const platformFullName = platformMap[rom.platform].libretroName
  if (!platformFullName) {
    return ''
  }

  const typeUrlPart = `Named_${capitalize(type)}s`
  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const pathPrefix = `gh/libretro-thumbnails/${normalizedPlatformFullName}@master`
  const normalizedFileName = name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')
  const encode = encodeRFC3986URIComponent
  return `https://cdn.jsdelivr.net/${pathPrefix}/${encode(typeUrlPart)}/${encode(normalizedFileName)}.png`
}

export function getRomTitle(rom) {
  return rom.fbneo_game_info?.fullName || rom.good_code?.rom || rom.libretro_rdb?.name
}
