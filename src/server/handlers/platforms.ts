import type { Context } from 'hono'
import { platformsMap } from '../constants.ts'

export function platforms(c: Context) {
  try {
    const defaultPlatforms = Object.entries(platformsMap).map(([name, platformDetail]) => platformDetail)
    const userPlatforms = c.var.user.user_metadata.platforms || defaultPlatforms
    return c.var.ok({ platforms: userPlatforms || defaultPlatforms })
  } catch (error) {
    console.error(error)
    return c.var.error(error)
  }
}
