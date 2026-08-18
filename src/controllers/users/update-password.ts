import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { getAuthMode } from '#@/constants/auth.ts'
import { sessionTable, statusEnum, userTable } from '#@/databases/schema.ts'
import { hash, verify } from '#@/utils/server/argon2.ts'

export async function updatePassword(currentPassword: string, newPassword: string) {
  if (getAuthMode() !== 'local') {
    throw new HTTPException(403, { message: 'Password changes are unavailable with external authentication' })
  }
  const c = getContext()
  const { currentUser, db, token } = c.var
  const userId = currentUser?.id

  const [user] = await db.library.select().from(userTable).where(eq(userTable.id, userId)).limit(1)
  if (!user) {
    throw new HTTPException(404, { message: 'User not found' })
  }

  const isValid = user.passwordHash ? await verify(user.passwordHash, currentPassword) : false
  if (!isValid) {
    throw new HTTPException(401, { message: 'Invalid current password' })
  }

  const newHash = await hash(newPassword)

  await db.library.update(userTable).set({ passwordHash: newHash }).where(eq(userTable.id, userId))
  await db.library.update(sessionTable).set({ status: statusEnum.deleted }).where(eq(sessionTable.userId, userId))
  if (token) {
    await db.library
      .update(sessionTable)
      .set({ status: statusEnum.normal })
      .where(and(eq(sessionTable.token, token), eq(sessionTable.userId, userId)))
  }

  return true
}
