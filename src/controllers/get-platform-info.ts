import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'

export async function getPlatformInfo(platform: string) {
  const { db } = getContextData()

  const { launchboxName } = platformMap[platform]
  if (launchboxName) {
    return await db.query.launchboxPlatform.findFirst({
      where: ({ name }, { eq }) => eq(name, launchboxName),
    })
  }
}
