import { and, eq, gt } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { DateTime } from 'luxon'
import { getAuthMode } from '#@/constants/auth.ts'
import { authenticationMethodEnum, libraryModeEnum, sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'

export async function getCurrentUser() {
  const c = getContext()
  const authMode = getAuthMode()
  if (authMode === 'supabase') {
    const { supabase } = c.var
    if (!supabase) {
      return
    }
    try {
      const { data } = await supabase.auth.getUser()
      if (data?.user) {
        return { ...data.user, libraryMode: libraryModeEnum.isolated }
      }
    } catch {
      return
    }
  }

  const { db, token } = c.var

  if (!token) {
    return
  }

  const [result] = await db.library
    .select()
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(
      and(
        eq(sessionTable.token, token),
        eq(sessionTable.status, statusEnum.normal),
        eq(userTable.status, statusEnum.normal),
        eq(
          sessionTable.authenticationMethod,
          authMode === 'oidc' ? authenticationMethodEnum.oidc : authenticationMethodEnum.password,
        ),
        gt(sessionTable.expiresAt, new Date()),
      ),
    )
    .limit(1)

  if (!result) {
    return
  }

  if (result.sessions.authenticationMethod === authenticationMethodEnum.oidc) {
    const now = DateTime.now()
    const lastActivity = DateTime.fromJSDate(new Date(result.sessions.lastActivityAt))
    if (now.diff(lastActivity, 'minutes').minutes >= 5) {
      await db.library
        .update(sessionTable)
        .set({ lastActivityAt: now.toJSDate() })
        .where(eq(sessionTable.id, result.sessions.id))
    }
    return {
      id: result.users.id,
      libraryMode: result.users.libraryMode,
      username: result.users.username,
    }
  }

  // Auto-renewal logic with Luxon
  const now = DateTime.now()
  const lastActivity = DateTime.fromJSDate(new Date(result.sessions.lastActivityAt))
  const expiresAt = DateTime.fromJSDate(new Date(result.sessions.expiresAt))

  const timeSinceActivity = now.diff(lastActivity, 'milliseconds').milliseconds
  const hoursUntilExpiry = expiresAt.diff(now, 'hours').hours

  // Session renewal threshold (renew if expires within 24 hours)
  const RENEWAL_THRESHOLD_HOURS = 24
  const ACTIVITY_UPDATE_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

  let shouldUpdate = false
  let newExpiresAt = expiresAt
  let newLastActivityAt = lastActivity

  // Renew session if close to expiry
  if (hoursUntilExpiry <= RENEWAL_THRESHOLD_HOURS) {
    newExpiresAt = now.plus({ days: 30 }) // Extend by 30 days
    shouldUpdate = true
  }

  // Update activity if enough time has passed
  if (timeSinceActivity >= ACTIVITY_UPDATE_INTERVAL) {
    newLastActivityAt = now
    shouldUpdate = true
  }

  if (shouldUpdate) {
    await db.library
      .update(sessionTable)
      .set({
        expiresAt: newExpiresAt.toJSDate(),
        lastActivityAt: newLastActivityAt.toJSDate(),
      })
      .where(eq(sessionTable.id, result.sessions.id))
  }

  return {
    id: result.users.id,
    libraryMode: result.users.libraryMode,
    username: result.users.username,
  }
}
