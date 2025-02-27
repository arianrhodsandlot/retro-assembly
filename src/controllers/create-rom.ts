import { rom } from '../databases/library/schema.ts'
import { getC } from '../utils/misc.ts'

interface CreateRomParams {
  fileId: string
  fileName: string
  launchboxGameId: number | undefined
  libretroGameId: string | undefined
  platform: string
}

export async function createRom(params: CreateRomParams) {
  const c = getC()
  const { library } = c.get('db')
  const currentUser = c.get('currentUser')

  const [result] = await library
    .insert(rom)
    .values({
      file_id: params.fileId,
      file_name: params.fileName,
      launchbox_game_id: params.launchboxGameId,
      libretro_game_id: params.libretroGameId,
      platform: params.platform,
      user_id: currentUser.id,
    })
    .returning()

  return result
}
