import { getContext } from 'hono/context-storage'
import { deleteCookie, getCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import { DateTime } from 'luxon'
import { authorizationCodeGrant } from 'openid-client'
import { getAuthMode, getSafeRedirectTo } from '#@/constants/auth.ts'
import { createSessionForUser } from '#@/controllers/sessions/create-session.ts'
import { getOrCreateOidcUser } from '#@/controllers/users/get-or-create-oidc-user.ts'
import { authenticationMethodEnum } from '#@/databases/schema.ts'
import {
  getOidcCallbackUrl,
  getOidcConfiguration,
  getOidcSettings,
  getOidcUsernameAndRoles,
} from '#@/utils/server/oidc.ts'
import { isSecureRequest, setSessionCookie } from '#@/utils/server/session.ts'
import type { Route } from './+types/login-oidc-callback.ts'

const flowCookiePath = '/login/oidc/callback'

function clearFlowCookies() {
  const c = getContext()
  for (const name of ['oidc-code-verifier', 'oidc-nonce', 'oidc-redirect-to', 'oidc-state']) {
    deleteCookie(c, name, { path: flowCookiePath })
  }
}

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  if (getAuthMode() !== 'oidc') {
    throw c.redirect('/login')
  }

  const codeVerifier = getCookie(c, 'oidc-code-verifier')
  const nonce = getCookie(c, 'oidc-nonce')
  const state = getCookie(c, 'oidc-state')
  const redirectTo = getSafeRedirectTo(getCookie(c, 'oidc-redirect-to'))

  if (!codeVerifier || !nonce || !state) {
    clearFlowCookies()
    throw c.redirect('/login?error=oidc_invalid_state')
  }

  try {
    const callbackUrl = new URL(getOidcCallbackUrl())
    callbackUrl.search = new URL(request.url).search
    const tokenSet = await authorizationCodeGrant(await getOidcConfiguration(), callbackUrl, {
      expectedNonce: nonce,
      expectedState: state,
      pkceCodeVerifier: codeVerifier,
    })
    const claims = tokenSet.claims()
    if (!claims) {
      throw new Error('The OIDC response does not contain an ID token')
    }

    const { roles, username } = getOidcUsernameAndRoles(claims)
    const settings = getOidcSettings()
    if (!roles.includes(settings.requiredRole)) {
      throw new HTTPException(403, { message: 'The OIDC identity does not have the required role' })
    }

    const user = getOrCreateOidcUser({ issuer: claims.iss, subject: claims.sub, username })
    const expiresAt = DateTime.now().plus({ milliseconds: settings.sessionMaxAge }).toJSDate()
    const session = await createSessionForUser({
      authenticationMethod: authenticationMethodEnum.oidc,
      expiresAt,
      userId: user.id,
    })
    setSessionCookie(
      session.token,
      session.expiresAt,
      isSecureRequest() || new URL(getOidcCallbackUrl()).protocol === 'https:',
    )
    clearFlowCookies()
    throw c.redirect(redirectTo)
  } catch (error) {
    if (error instanceof Response) {
      throw error
    }
    console.error('OIDC callback failed:', error instanceof Error ? error.message : 'Unknown error')
    clearFlowCookies()
    throw c.redirect('/login?error=oidc_callback_failed')
  }
}

export { noop as default } from 'es-toolkit'
