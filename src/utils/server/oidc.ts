import { getContext } from 'hono/context-storage'
import { type Configuration, discovery } from 'openid-client'
import { getRunTimeEnv } from '#@/constants/env.ts'

let configurationPromise: Promise<Configuration> | undefined

export function getOidcSettings() {
  const env = getRunTimeEnv()
  const configuredMaxAge = Math.trunc(Number(env.RETROASSEMBLY_RUN_TIME_OIDC_SESSION_MAX_AGE))
  return {
    clientId: env.RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID,
    clientSecret: env.RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET,
    issuer: env.RETROASSEMBLY_RUN_TIME_OIDC_ISSUER,
    redirectUri: env.RETROASSEMBLY_RUN_TIME_OIDC_REDIRECT_URI,
    requiredRole: env.RETROASSEMBLY_RUN_TIME_OIDC_REQUIRED_ROLE.trim(),
    scopes: env.RETROASSEMBLY_RUN_TIME_OIDC_SCOPES,
    sessionMaxAge: configuredMaxAge > 0 ? configuredMaxAge : 8 * 60 * 60 * 1000,
  }
}

export function getOidcCallbackUrl() {
  const c = getContext()
  return getOidcSettings().redirectUri || new URL('/login/oidc/callback', c.req.url).href
}

export function getOidcConfiguration() {
  if (!configurationPromise) {
    const settings = getOidcSettings()
    configurationPromise = discovery(new URL(settings.issuer), settings.clientId, settings.clientSecret)
  }
  return configurationPromise
}

export function getOidcUsernameAndRoles(claims: Record<string, unknown>, requireRoles = false) {
  const username = claims.preferred_username
  const rawRoles = claims.roles
  const roles = typeof rawRoles === 'string' ? [rawRoles] : rawRoles

  if (typeof username !== 'string' || !username.trim()) {
    throw new Error('The OIDC response does not contain a valid preferred_username claim')
  }
  if (requireRoles && (!Array.isArray(roles) || roles.some((role) => typeof role !== 'string'))) {
    throw new Error('The OIDC response does not contain a valid roles claim')
  }

  return { roles: Array.isArray(roles) ? roles : [], username: username.trim() }
}
