import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { z } from 'zod'
import { getAuthMode } from '#@/constants/auth.ts'
import { createSession } from '#@/controllers/sessions/create-session.ts'
import { createUser } from '#@/controllers/users/create-user.ts'
import { updatePassword } from '#@/controllers/users/update-password.ts'
import { setSessionCookie } from '#@/utils/server/session.ts'

export const app = new Hono()

  .post(
    'login',

    zValidator(
      'form',
      z.object({
        password: z.string(),
        username: z.string(),
      }),
    ),

    async (c) => {
      if (getAuthMode() !== 'local') {
        throw new HTTPException(403, { message: 'Password login is disabled' })
      }
      const form = c.req.valid('form')
      const { session, user } = await createSession(form)
      setSessionCookie(session.token, session.expiresAt)
      return c.json({ session, user })
    },
  )

  .post(
    'register',

    zValidator(
      'form',
      z.object({
        password: z.string(),
        username: z.string(),
      }),
    ),

    async (c) => {
      if (getAuthMode() !== 'local') {
        throw new HTTPException(403, { message: 'Password registration is disabled' })
      }
      const form = c.req.valid('form')
      await createUser(form)
      const { session, user } = await createSession(form)
      setSessionCookie(session.token, session.expiresAt)
      return c.json({ session, user })
    },
  )

  .patch(
    'password',

    zValidator(
      'form',
      z.object({
        new_password: z.string(),
        password: z.string(),
      }),
    ),

    async (c) => {
      const form = c.req.valid('form')
      await updatePassword(form.password, form.new_password)
      return c.json(true)
    },
  )
