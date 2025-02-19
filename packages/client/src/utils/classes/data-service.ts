import type { SupabaseClient, User } from '@supabase/supabase-js'
import { platformMap } from '@/constants/platform'

export class DataService {
  private launchboxGameTableName = 'retroassembly_launchbox_game'
  private romTableName = 'retroassembly_rom'

  private supabase: SupabaseClient
  private user: User

  private get romTable() {
    return this.supabase.from(this.romTableName)
  }

  constructor({ supabase, user }: { supabase: SupabaseClient; user: User }) {
    this.supabase = supabase
    this.user = user
  }

  async getRom(id: string) {
    const { romTable } = this
    const { data: rom } = await romTable.select().eq('user_id', this.user.id).eq('id', id).maybeSingle()
    const { data: launchboxGame } = await this.supabase
      .from(this.launchboxGameTableName)
      .select()
      .eq('name', rom.good_code.rom)
      .eq('platform', platformMap[rom.platform].launchboxName)
      .maybeSingle()

    return { launchboxGame, rom }
  }

  async getRoms({ platform }: { platform?: string } = {}) {
    const { romTable } = this
    const query = romTable.select().eq('user_id', this.user.id)
    if (platform) {
      query.eq('platform', platform)
    }
    const { data } = await query
    return data || []
  }
}
