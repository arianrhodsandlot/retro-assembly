import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import { env } from 'hono/adapter'
import type { Middleware } from 'waku/config'
import { getHonoContext } from 'waku/unstable_hono'

// eslint-disable-next-line func-style
const middleware: Middleware = () => {
  return async (ctx, next) => {
    const honoContext = getHonoContext()
    const { SUPABASE_ANON_KEY, SUPABASE_URL } = env(honoContext)
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return parseCookieHeader(ctx.req.headers.cookie)
        },
        setAll(cookiesToSet) {
          if (ctx.res.headers) {
            for (const { name, options, value } of cookiesToSet) {
              ctx.res.headers['set-cookie'] = serializeCookieHeader(name, value, options)
            }
          }
        },
      },
    })

    const { data } = await supabase.auth.getUser()
    ctx.data.currentUser = data?.user

    const controller = {
      auth() {
        supabase.auth()
      },

      getCurrentUser() {
        return ctx.data.currentUser
      },

      async getRom(id: string) {
        const romTable = supabase.from('retroassembly_rom')
        const { data: rom } = await romTable.select().eq('user_id', ctx.data.currentUser.id).eq('id', id).maybeSingle()
        const { data: launchboxGameInfo } = await this.supabase
          .from(this.launchboxGameTableName)
          .select()
          .eq('name', rom.good_code.rom)
          .eq('platform', platformMap[rom.platform].launchboxName)
          .maybeSingle()

        return { launchboxGameInfo, rom }
      },

      async getRoms({ platform }: { platform?: string } = {}) {
        const romTable = supabase.from('retroassembly_rom')
        const query = romTable.select().eq('user_id', ctx.data.currentUser.id)
        if (platform) {
          query.eq('platform', platform)
        }
        const { data } = await query
        return data || []
      },
    }
    ctx.data.controller = controller
    await next()
  }
}
export default middleware
