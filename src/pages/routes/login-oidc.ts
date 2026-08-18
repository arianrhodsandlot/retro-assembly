import { getContext } from 'hono/context-storage'
import { setCookie } from 'hono/cookie'
import {
  buildAuthorizationUrl,
  calculatePKCECodeChallenge,
  randomNonce,
  randomPKCECodeVerifier,
  randomState,
} from 'openid-client'
import { getAuthMode, getSafeRedirectTo } from '#@/constants/auth.ts'
import { getOidcCallbackUrl, getOidcConfiguration, getOidcSettings } from '#@/utils/server/oidc.ts'
import { isSecureRequest } from '#@/utils/server/session.ts'
import type { Route } from './+types/login-oidc.ts'

const flowCookieOptions = {
  httpOnly: true,
  maxAge: 10 * 60,
  path: '/login/oidc/callback',
  sameSite: 'Lax',
} as const

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  if (getAuthMode() !== 'oidc') {
    throw c.redirect('/login')
  }

  const redirectTo = getSafeRedirectTo(new URL(request.url).searchParams.get('redirect_to'))
  if (c.var.currentUser) {
    throw c.redirect(redirectTo)
  }

  const configuration = await getOidcConfiguration()
  const codeVerifier = randomPKCECodeVerifier()
  const codeChallenge = await calculatePKCECodeChallenge(codeVerifier)
  const nonce = randomNonce()
  const state = randomState()
  const secure = isSecureRequest() || new URL(getOidcCallbackUrl()).protocol === 'https:'
  const options = { ...flowCookieOptions, secure }
  setCookie(c, 'oidc-code-verifier', codeVerifier, options)
  setCookie(c, 'oidc-nonce', nonce, options)
  setCookie(c, 'oidc-redirect-to', redirectTo, options)
  setCookie(c, 'oidc-state', state, options)

  const authorizationUrl = buildAuthorizationUrl(configuration, {
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    nonce,
    redirect_uri: getOidcCallbackUrl(),
    scope: getOidcSettings().scopes,
    state,
  })
  throw c.redirect(authorizationUrl.href)
}

export { noop as default } from 'es-toolkit'
