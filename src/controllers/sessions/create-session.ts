import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { DateTime } from 'luxon'
import { authenticationMethodEnum, sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'
import { verify } from '#@/utils/server/argon2.ts'
import { getConnInfo } from '#@/utils/server/misc.ts'
import { nanoid } from '#@/utils/server/nanoid.ts'

const invalidException = new HTTPException(401, { message: 'Invalid username or password' })

export async function createSession({ password, username }: { password: string; username: string }) {
  const c = getContext()
  const { db } = c.var

  const [user] = await db.library
    .select()
    .from(userTable)
    .where(and(eq(userTable.username, username.trim()), eq(userTable.status, statusEnum.normal)))
    .limit(1)

  if (!user) {
    throw invalidException
  }

  const isValidPassword = user.passwordHash ? await verify(user.passwordHash, password) : false
  if (!isValidPassword) {
    throw invalidException
  }

  const session = await createSessionForUser({
    authenticationMethod: authenticationMethodEnum.password,
    expiresAt: DateTime.now().plus({ days: 30 }).toJSDate(),
    userId: user.id,
  })

  return {
    session,
    user: {
      id: user.id,
      libraryMode: user.libraryMode,
      username: user.username,
    },
  }
}

export async function createSessionForUser({
  authenticationMethod,
  expiresAt,
  userId,
}: {
  authenticationMethod: (typeof authenticationMethodEnum)[keyof typeof authenticationMethodEnum]
  expiresAt: Date
  userId: string
}) {
  const c = getContext()
  const { db } = c.var
  const [session] = await db.library
    .insert(sessionTable)
    .values({
      authenticationMethod,
      expiresAt,
      ip: getConnInfo()?.remote.address,
      token: nanoid(),
      userAgent: c.req.header('User-Agent'),
      userId,
    })
    .returning()
  return session
}
