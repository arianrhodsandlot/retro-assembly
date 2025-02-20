import { delay } from 'es-toolkit'
import ky from 'ky'
import useSWRImmutable from 'swr/immutable'
import { getRomLibretroThumbnail, getRomPlatformThumbnail } from '@/utils/rom'

export function useRomCover(rom) {
  const romCover = getRomLibretroThumbnail(rom)
  const platformCover = getRomPlatformThumbnail(rom)

  return useSWRImmutable([romCover, platformCover], async () => {
    await delay(1000)
    try {
      await ky.head(romCover)
      return { src: romCover, type: 'rom' }
    } catch {}
    return { src: platformCover, type: 'platform' }
  })
}
