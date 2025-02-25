import { getContextData } from 'waku/middleware/context'
import { launchboxPlatform } from '@/database/schema.ts'

export async function getRoms({ platform }: { platform?: string } = {}) {
  const { currentUser, drizzle, supabase } = getContextData()

  const platforms = await drizzle?.select().from(launchboxPlatform).limit(10)

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
