import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'

export async function getRom(id: string) {
  const { currentUser, supabase } = getContextData()

  if (!supabase) {
    return
  }

  const { data: rom } = await supabase
    .from('retroassembly_rom')
    .select()
    .eq('user_id', currentUser.id)
    .eq('id', id)
    .maybeSingle()

  const { data: launchboxGameInfo } = await supabase
    .from('retroassembly_launchbox_game')
    .select()
    .eq('name', rom.good_code.rom)
    .eq('platform', platformMap[rom.platform].launchboxName)
    .maybeSingle()

  return { launchboxGameInfo, rom }
}
