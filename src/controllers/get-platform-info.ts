import { platformMap } from '../constants/platform.ts'
import { getC } from '../utils/misc.ts'

export async function getPlatformInfo(platform: string) {
  const { metadata } = getC().get('db')

  const { launchboxName } = platformMap[platform]
  if (launchboxName) {
    return await metadata.query.launchboxPlatform.findFirst({
      where: ({ name }, { eq }) => eq(name, launchboxName),
    })
  }
}
