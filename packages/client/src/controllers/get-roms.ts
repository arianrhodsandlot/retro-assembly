import { getContextData } from 'waku/middleware/context'

export async function getRoms({ platform }: { platform?: string } = {}) {
  const { currentUser, prisma, supabase } = getContextData()

  const platforms = await prisma.launchboxPlatform.findMany({ take: 10 })
  console.log(platforms)

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
