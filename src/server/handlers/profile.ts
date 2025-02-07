import type { Context } from 'hono'
import { ok } from '../utils.ts'

export async function profile(c: Context) {
  const supabase = c.get('supabase')
  const { data, error } = await supabase.auth.getUser()
  return ok(c, { error, preference: {}, user: data })
}
