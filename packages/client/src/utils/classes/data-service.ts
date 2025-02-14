import type { SupabaseClient, User } from '@supabase/supabase-js'

export class DataService {
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

  async getRom(id) {
    const { romTable } = this
    const { data } = await romTable.select().eq('user_id', this.user.id).eq('id', id).maybeSingle()
    return data
  }

  async getRoms() {
    const { romTable } = this
    const { data } = await romTable.select().eq('user_id', this.user.id)
    return data || []
  }
}
