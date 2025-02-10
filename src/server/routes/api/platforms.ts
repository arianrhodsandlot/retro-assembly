import path from 'node:path'
import { castArray } from 'lodash-es'
import { platformFullNameMap } from '../../constants/platform.ts'
import { api } from './app.ts'

api.get('/platforms', (c) => {
  try {
    const defaultPlatforms = Object.entries(platformFullNameMap).map(([name, platformDetail]) => platformDetail)
    const userPlatforms = c.var.user.user_metadata.platforms || defaultPlatforms
    return c.var.ok({ platforms: userPlatforms || defaultPlatforms })
  } catch (error) {
    console.error(error)
    return c.var.error(error)
  }
})

api.get('/platform/:platform/roms', async (c) => {
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')
  const platform = c.req.param('platform')

  const romsPath = path.join(rootDirectory, platform, '/')

  const entries = await op.list(romsPath)
  const roms = entries.slice(1).map((entry) => entry.path())

  return c.var.ok({
    platform: { id: platform },
    roms,
    romsPath,
  })
})

api.get('/platform/:platform/rom/upload/test', (c) => {
  return c.html(`
    <html>
    <body>
      <form method="post" action="/api/platform/${c.req.param('platform')}/rom/upload" enctype="multipart/form-data">
        <input name="file" type="file" multiple />
        <button type="submit">Upload ROM</button>
      </form>
      </body>
    </html>
  `)
})

api.post('/platform/:platform/rom/upload', async (c) => {
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')
  const platform = c.req.param('platform')

  const romDirectory = path.join(rootDirectory, platform)

  const body = await c.req.parseBody<{ file: File }>({ all: true })
  const files = castArray(body.file)
  await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const romPath = path.join(romDirectory, file.name)
      await op.write(romPath, buffer)
    }),
  )
  return c.var.ok()
})

api.get('/platform/:platform/rom/:rom', async (c) => {
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')
  const platform = c.req.param('platform')
  const rom = c.req.param('rom')

  const romPath = path.join(rootDirectory, platform, rom)

  const romContent = await op.read(romPath)
  return c.var.ok({
    romContent: romContent.toString(),
  })
})
