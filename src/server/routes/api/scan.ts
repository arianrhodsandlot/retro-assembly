import path from 'node:path'
import { parse } from 'goodcodes-parser'
import { searchRdbRomInfo } from '../../utils/libretrodb.ts'
import { api } from './app.ts'

api.get('/scan', async (c) => {
  const op = c.get('op')
  const user = c.get('user')
  const supabase = c.get('supabase')
  const { rootDirectory } = c.get('preference')

  const entries = await op.list(rootDirectory, { recursive: true })
  const rawRomInfoList = entries
    .filter((entry) => !entry.path().endsWith('/'))
    .map((entry) => {
      const filePath = entry.path()
      const relativePath = path.relative(rootDirectory, path.join('/', filePath))
      const { base, dir } = path.parse(relativePath)

      return { fileName: base, filePath, platform: dir }
    })

  const rows = await Promise.all(
    rawRomInfoList.map(async (rawRomInfo) => {
      const rdbRomInfo = await searchRdbRomInfo(rawRomInfo)
      return {
        file_id: [user.id, rawRomInfo.filePath].join('#'),
        file_name: rawRomInfo.fileName,
        file_path: rawRomInfo.filePath,
        good_code: parse(rdbRomInfo.rom_name || rawRomInfo.fileName),
        libretro_rdb: rdbRomInfo,
        platform: rawRomInfo.platform,
        user_id: user.id,
      }
    }),
  )

  const { data, error } = await supabase.from('retroassembly_rom').upsert(rows, { onConflict: 'file_id' }).select()

  if (data) {
    return c.var.ok(data)
  }

  return c.var.error(error)
})
