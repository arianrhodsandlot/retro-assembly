import { and, asc, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { getAuthMode } from '#@/constants/auth.ts'
import { statusEnum, userTable } from '#@/databases/schema.ts'
import { hash } from '#@/utils/server/argon2.ts'
import { getConnInfo } from '#@/utils/server/misc.ts'

export async function createUser({
  libraryMode = 0,
  password,
  requireSuperUser = false,
  username,
}: {
  libraryMode?: number
  password?: string
  requireSuperUser?: boolean
  username: string
}) {
  const c = getContext()
  const { db } = c.var

  if (requireSuperUser) {
    const [superUser] = await db.library
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.status, statusEnum.normal))
      .orderBy(asc(userTable.createdAt))
      .limit(1)
    if (!superUser || superUser.id !== c.var.currentUser?.id) {
      throw new HTTPException(403, { message: 'Forbidden' })
    }
  }

  const [existing] = await db.library
    .select()
    .from(userTable)
    .where(and(eq(userTable.username, username.trim()), eq(userTable.status, statusEnum.normal)))
    .limit(1)
  if (existing) {
    throw new HTTPException(409, { message: 'Username already exists' })
  }

  const authMode = getAuthMode()
  if (authMode === 'supabase') {
    throw new HTTPException(403, { message: 'Local user creation is unavailable' })
  }
  if (authMode === 'local' && !password) {
    throw new HTTPException(400, { message: 'Password is required' })
  }
  if (authMode === 'oidc' && password) {
    throw new HTTPException(400, { message: 'Passwords are unavailable with OIDC authentication' })
  }
  const passwordHash = password ? await hash(password) : null

  const [user] = await db.library
    .insert(userTable)
    .values({
      libraryMode,
      passwordHash,
      registrationIp: getConnInfo()?.remote.address,
      registrationUserAgent: c.req.header('User-Agent'),
      username: username.trim(),
    })
    .returning()

  return {
    id: user.id,
    libraryMode: user.libraryMode,
    username: user.username,
  }
}
