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
  const user = c.get('user')
  const supabase = c.get('supabase')
  const platform = c.req.param('platform')

  const entries = await supabase.from('retroassembly_rom').select().eq('user_id', user.id).eq('platform', platform)

  return c.json(entries)
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

api.get('/platform/:platform/rom/:rom/content', async (c) => {
  const user = c.get('user')
  const supabase = c.get('supabase')
  const op = c.get('op')
  const { rootDirectory } = c.get('preference')

  const platform = c.req.param('platform')
  const rom = c.req.param('rom')

  const entry = await supabase
    .from('retroassembly_rom')
    .select()
    .eq('user_id', user.id)
    .eq('platform', platform)
    .eq('file_name', rom)
    .maybeSingle()

  const romPath = path.join(rootDirectory, platform, entry.data.file_name)

  const buffer = await op.read(romPath)
  c.header('content-type', 'application/octet-stream')
  c.header('content-length', buffer.length.toString())
  c.header('content-disposition', `attachment; filename="${encodeURIComponent(entry.data.file_name)}"`)

  return c.body(buffer)
})
