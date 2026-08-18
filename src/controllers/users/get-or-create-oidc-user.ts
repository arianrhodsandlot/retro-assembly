import { and, eq } from 'drizzle-orm'
import { getContext } from 'hono/context-storage'
import { HTTPException } from 'hono/http-exception'
import { oidcIdentityTable, statusEnum, userTable } from '#@/databases/schema.ts'
import { getConnInfo } from '#@/utils/server/misc.ts'

export function getOrCreateOidcUser({
  issuer,
  subject,
  username,
}: {
  issuer: string
  subject: string
  username: string
}) {
  const c = getContext()
  const { db } = c.var

  return db.library.transaction((transaction) => {
    const [identity] = transaction
      .select({ user: userTable })
      .from(oidcIdentityTable)
      .innerJoin(userTable, eq(oidcIdentityTable.userId, userTable.id))
      .where(and(eq(oidcIdentityTable.issuer, issuer), eq(oidcIdentityTable.subject, subject)))
      .limit(1)
      .all()

    if (identity) {
      if (identity.user.status !== statusEnum.normal) {
        throw new HTTPException(403, { message: 'This account is no longer active' })
      }
      return identity.user
    }

    const [matchingUser] = transaction
      .select()
      .from(userTable)
      .where(and(eq(userTable.username, username), eq(userTable.status, statusEnum.normal)))
      .limit(1)
      .all()

    if (matchingUser) {
      const [existingIdentity] = transaction
        .select({ id: oidcIdentityTable.id })
        .from(oidcIdentityTable)
        .where(eq(oidcIdentityTable.userId, matchingUser.id))
        .limit(1)
        .all()
      if (existingIdentity) {
        throw new HTTPException(409, { message: 'This username belongs to another OIDC identity' })
      }

      transaction.insert(oidcIdentityTable).values({ issuer, subject, userId: matchingUser.id }).run()
      return matchingUser
    }

    const [user] = transaction
      .insert(userTable)
      .values({
        passwordHash: null,
        registrationIp: getConnInfo()?.remote.address,
        registrationUserAgent: c.req.header('User-Agent'),
        username,
      })
      .returning()
      .all()
    transaction.insert(oidcIdentityTable).values({ issuer, subject, userId: user.id }).run()
    return user
  })
}
