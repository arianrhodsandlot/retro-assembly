import { getContextData } from 'waku/middleware/context'

export async function getRoms({ platform }: { platform?: string } = {}) {
  const { currentUser, supabase } = getContextData()

  if (supabase) {
    const romTable = supabase.from('retroassembly_rom')
    const query = romTable.select().eq('user_id', currentUser.id)
    if (platform) {
      query.eq('platform', platform)
    }
    const { data } = await query
    return data || []
  }
  return []
}
