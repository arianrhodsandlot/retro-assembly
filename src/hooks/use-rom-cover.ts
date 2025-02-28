'use client'
import ky from 'ky'
import useSWRImmutable from 'swr/immutable'
import { getPlatformIcon, getRomLibretroThumbnail } from '../utils/rom.ts'

export function useRomCover(rom) {
  const romCover = getRomLibretroThumbnail(rom)
  const platformCover = getPlatformIcon(rom.platform)

  return useSWRImmutable([romCover, platformCover], async () => {
    if (romCover) {
      try {
        await ky.head(romCover)
        return { src: romCover, type: 'rom' }
      } catch {}
    }
    return { src: platformCover, type: 'platform' }
  })
}
