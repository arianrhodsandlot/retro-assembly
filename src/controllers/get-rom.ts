import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'
import { getCompactName } from '@/utils/rom.ts'

export async function getRom(id: string) {
  const { currentUser, db, supabase } = getContextData()

  if (!supabase) {
    return
  }

  const { data: rom } = await supabase
    .from('retroassembly_rom')
    .select()
    .eq('user_id', currentUser.id)
    .eq('id', id)
    .maybeSingle()

  const launchboxGameInfo = await db.query.launchboxGame.findFirst({
    where: ({ compact_name: compactName, platform }, { and, eq }) =>
      and(
        eq(compactName, getCompactName(rom.fbneo_game_info.fullName || rom.good_code.rom)),
        eq(platform, platformMap[rom.platform].launchboxName),
      ),
  })

  return { launchboxGameInfo, rom }
}
