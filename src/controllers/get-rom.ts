import { sql } from 'drizzle-orm'
import type { AnySQLiteColumn } from 'drizzle-orm/sqlite-core'
import { getContextData } from 'waku/middleware/context'
import { platformMap } from '@/constants/platform.ts'

function lower(email: AnySQLiteColumn) {
  return sql`lower(${email})`
}

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
    where: ({ name, platform }, { and, eq }) =>
      and(eq(lower(name), rom.good_code.rom.toLowerCase()), eq(platform, platformMap[rom.platform].launchboxName)),
  })

  return { launchboxGameInfo, rom }
}
