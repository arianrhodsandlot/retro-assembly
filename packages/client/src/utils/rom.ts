import { capitalize } from 'es-toolkit'
import { Nostalgist } from 'nostalgist'
import { platformMap } from '@/constants/platform'
import { getCDNUrl } from './cdn'

type LibretroThumbnailType = 'boxart' | 'snap' | 'title'

const { path } = Nostalgist.vendors

export function getRomLibretroThumbnail(rom, type: LibretroThumbnailType = 'boxart') {
  const name = rom.libretro_rdb?.name
  if (!name || !rom.platform) {
    return ''
  }
  const platformFullName = platformMap[rom.platform].libretroName
  if (!platformFullName) {
    return ''
  }

  const normalizedPlatformFullName = platformFullName.replaceAll(' ', '_')
  const repo = path.join('libretro-thumbnails', normalizedPlatformFullName)

  const fileDirectory = `Named_${capitalize(type)}s`
  const normalizedFileName = `${name.replaceAll(/[&*/:`<>?\\]|\|"/g, '_')}.png`
  const filePath = path.join(fileDirectory, normalizedFileName)

  return getCDNUrl(repo, filePath)
}

export function getRomPlatformThumbnail(rom, type = 'content', directory = 'xmb/flatui/png') {
  const platformFullName = platformMap[rom.platform].libretroName
  if (!platformFullName) {
    return ''
  }
  const repo = 'libretro/retroarch-assets'
  const fileName = type === 'content' ? `${platformFullName}-content.png` : `${platformFullName}.png`
  const filePath = path.join(directory, fileName)
  return getCDNUrl(repo, filePath)
}

export function getRomTitle(rom) {
  return rom.fbneo_game_info?.fullName || rom.good_code?.rom || rom.libretro_rdb?.name
}
