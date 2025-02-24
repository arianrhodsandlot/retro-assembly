import { getContextData } from 'waku/middleware/context'
import { getHonoContext } from 'waku/unstable_hono'
import { launchboxPlatform } from '@/database/schema.ts'

export async function getRoms({ platform }: { platform?: string } = {}) {
  const { currentUser, drizzle, supabase } = getContextData()

  const { DB } = getHonoContext().env

  const returnValue = await DB.exec(`SELECT * FROM LaunchboxPlatform WHERE CompanyName = "Bs Beverages"`)
  console.log(returnValue)

  // const platforms = await drizzle?.select().from(launchboxPlatform).limit(10)
  // console.log(platforms)

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
