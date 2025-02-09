import path from 'node:path'
import type { Context } from 'hono'

export async function roms(c: Context) {
  const platform = c.req.param('platform')

  const romsPath = path.join('/retroassembly', platform, '/')

  const entries = await c.var.op.list(romsPath)
  const roms = entries.map((entry) => entry.path())

  return c.var.ok({
    platform: { id: platform },
    roms,
    romsPath,
  })
}
