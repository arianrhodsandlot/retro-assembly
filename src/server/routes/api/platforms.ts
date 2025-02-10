import path from 'node:path'
import { castArray } from 'lodash-es'
import { platformsMap } from '../../constants/platform.ts'
import { api } from './app.ts'

api.get('/platforms', (c) => {
  try {
    const defaultPlatforms = Object.entries(platformsMap).map(([name, platformDetail]) => platformDetail)
    const userPlatforms = c.var.user.user_metadata.platforms || defaultPlatforms
    return c.var.ok({ platforms: userPlatforms || defaultPlatforms })
  } catch (error) {
    console.error(error)
    return c.var.error(error)
  }
})

api.get('/platform/:platform/roms', async (c) => {
  const platform = c.req.param('platform')
  const { rootDirectory } = c.get('preference')

  const romsPath = path.join(rootDirectory, platform, '/')

  const entries = await c.var.op.list(romsPath)
  const roms = entries.slice(1).map((entry) => entry.path())

  return c.var.ok({
    platform: { id: platform },
    roms,
    romsPath,
  })
})

api.post('/platform/:platform/rom/upload', async (c) => {
  const preference = c.get('preference')
  const platform = c.req.param('platform')

  const body = await c.req.parseBody<{ file: File }>({ all: true })
  const files = castArray(body.file)
  await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const romDirectory = path.join(preference.rootDirectory, platform)
      const romPath = path.join(romDirectory, file.name)
      await c.var.op.write(romPath, buffer)
    }),
  )
  return c.var.ok()
})

api.get('/platform/:platform/rom/:rom', async (c) => {
  const preference = c.get('preference')
  const platform = c.req.param('platform')
  const rom = c.req.param('rom')

  const romPath = path.join(preference.rootDirectory, platform, rom)

  const romContent = await c.var.op.read(romPath)
  return c.var.ok({
    romContent: romContent.toString(),
  })
})
