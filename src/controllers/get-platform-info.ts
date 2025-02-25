import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'

export async function getPlatformInfo(platform: string) {
  const { drizzle } = getContextData()

  const { launchboxName } = platformMap[platform]
  if (launchboxName) {
    return await drizzle.query.launchboxPlatform.findFirst({
      where: ({ name }, { eq }) => eq(name, launchboxName),
    })
  }
}
