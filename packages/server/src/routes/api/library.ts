import path from 'node:path'
import { parse } from 'goodcodes-parser'
import { opendal } from '../../middlewares/opendal.ts'
import { getFBNeoGameInfo } from '../../utils/fbneo-game-info.ts'
import { searchRdbRomInfo } from '../../utils/libretrodb.ts'
import { api } from './app.ts'

async function queryRomInfo({ fileName, platform }: { fileName: string; platform: string }) {
  const [rdbRomInfo, fbneoGameInfo] = await Promise.all([
    searchRdbRomInfo({ fileName, platform }),
    getFBNeoGameInfo({ fileName, platform }),
  ])

  return {
    fbneo_game_info: fbneoGameInfo,
    file_name: fileName,
    good_code: parse(rdbRomInfo?.rom_name || fileName),
    libretro_rdb: rdbRomInfo,
    platform,
  }
}

api.get('library/query', async (c) => {
  const platform = c.req.query('platform') || ''
  const rom = c.req.query('rom') || ''

  const info = await queryRomInfo({ fileName: rom, platform })
  return c.var.ok(info)
})

api.all('library/scan', opendal(), async (c) => {
  const op = c.get('op')
  const user = c.get('user')
  const supabase = c.get('supabase')
  const { rootDirectory } = c.get('preference')

  const entries = await op.list(rootDirectory, { recursive: true })
  const rawRomInfoList = entries
    .filter((entry) => !entry.path().endsWith('/'))
    .map((entry) => {
      const absolutePath = path.join('/', entry.path())
      const relativePath = path.relative(rootDirectory, absolutePath)
      const { base, dir } = path.parse(relativePath)

      return { fileName: base, filePath: relativePath, platform: dir }
    })

  const roms = await Promise.all(
    rawRomInfoList.map(async (rawRomInfo) => ({
      ...(await queryRomInfo(rawRomInfo)),
      file_id: [user.id, rawRomInfo.filePath].join('#'),
      file_path: rawRomInfo.filePath,
      user_id: user.id,
    })),
  )

  const { data, error } = await supabase.from('retroassembly_rom').upsert(roms, { onConflict: 'file_id' }).select()

  if (data) {
    return c.var.ok(data)
  }

  return c.var.error(error)
})
