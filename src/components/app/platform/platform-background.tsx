import { platformMap } from '@/constants/platform.ts'
import { getCDNUrl } from '@/utils/cdn.ts'
import { MainBackground } from '../main-background.tsx'

export function PlatformBackground({ platform }: { platform: string }) {
  const platformBackgroundUrl = getCDNUrl(
    'HerbFargus/es-theme-tronkyfran',
    `${platform}/art/${platform.replace('atari', 'a')}_art_blur.jpg`,
  )
  return <MainBackground alt={platformMap[platform].displayName} src={platformBackgroundUrl} />
}
