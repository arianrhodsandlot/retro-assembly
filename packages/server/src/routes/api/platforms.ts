import path from 'node:path'
import { platformFullNameMap } from '../../constants/platform.ts'
import { opendal } from '../../middlewares/opendal.ts'
import { api } from './app.ts'

api.use('platform/:platform/*', async (c, next) => {
  const platform = c.req.param('platform')
  if (!(platform in platformFullNameMap)) {
    return c.var.error({ message: 'Invalid platform' })
  }
  await next()
})

api.get('platforms', (c) => {
  const defaultPlatformNames = ['gba', 'nes', 'snes', 'megadrive', 'atari2600', 'arcade']
  try {
    const platformNames = c.var.user.user_metadata.platforms || defaultPlatformNames
    const platforms = platformNames.map((platform) => ({
      fullName: platformFullNameMap[platform],
      name: platform,
    }))
    return c.var.ok({ platforms })
  } catch (error) {
    console.error(error)
    return c.var.error(error)
  }
})

api.get('platform/:platform/roms', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const platform = c.req.param('platform')

  const entries = await supabase.from('retroassembly_rom').select().eq('user_id', user.id).eq('platform', platform)

  return c.json(entries)
})

api.get('platform/:platform/rom/upload/test', (c) => {
  return c.html(`
    <html>
    <body>
      <form method="post" action="/api/v1/platform/${c.req.param('platform')}/rom/upload" enctype="multipart/form-data">
        <input name="file" type="file" multiple />
        <button type="submit">Upload ROM</button>
      </form>
      </body>
    </html>
  `)
})

api.post('platform/:platform/rom/upload', opendal(), async (c) => {
  console.log(1111)
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')
  const platform = c.req.param('platform')

  const romDirectory = path.join(rootDirectory, platform)

  const body = await c.req.parseBody<{ file: File }>({ all: true })
  const files = Array.isArray(body.file) ? body.file : [body.file]
  await Promise.all(
    files.map(async (file) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const romPath = path.join(romDirectory, file.name)
      await op.write(romPath, buffer)
    }),
  )
  return c.var.ok()
})

api.get('platform/:platform/rom/:rom', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const platform = c.req.param('platform')
  const rom = c.req.param('rom')

  const entry = await supabase
    .from('retroassembly_rom')
    .select()
    .eq('user_id', user.id)
    .eq('platform', platform)
    .eq('file_name', rom)
    .maybeSingle()

  return c.json(entry)
})

api.get('rom/:id/content', opendal(), async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')

  const id = c.req.param('id')

  const entry = await supabase.from('retroassembly_rom').select().eq('user_id', user.id).eq('id', id).maybeSingle()

  const romPath = path.join(rootDirectory, entry.data.file_path)

  const buffer = await op.read(romPath)
  c.header('content-type', 'application/octet-stream')
  c.header('content-length', buffer.length.toString())
  c.header('content-disposition', `attachment; filename="${encodeURIComponent(entry.data.file_name)}"`)

  return c.body(buffer)
})
