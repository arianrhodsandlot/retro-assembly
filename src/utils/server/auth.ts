import assert from 'node:assert'
import { getRuntimeKey } from 'hono/adapter'
import { defaultRedirectTo, type AuthMode } from '#@/constants/auth.ts'
import { getRunTimeEnv } from '#@/constants/env.ts'

export function getAuthMode(): AuthMode {
  return resolveAuthMode(getRunTimeEnv(), getRuntimeKey())
}

export function resolveAuthMode(env: Record<string, unknown>, runtimeKey: string): AuthMode {
  const oidcValues = [
    env.RETROASSEMBLY_RUN_TIME_OIDC_ISSUER,
    env.RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID,
    env.RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET,
  ]
  const hasOidcConfiguration = oidcValues.some(Boolean)

  if (hasOidcConfiguration) {
    assert.ok(runtimeKey === 'node', 'OIDC authentication is only supported by the Node.js runtime')
    assert.ok(oidcValues.every(Boolean), 'OIDC issuer, client ID, and client secret must all be set')
    assert.ok(
      !env.RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY && !env.RETROASSEMBLY_RUN_TIME_SUPABASE_URL,
      'OIDC and Supabase authentication cannot be enabled together',
    )
    return 'oidc'
  }

  if (env.RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY && env.RETROASSEMBLY_RUN_TIME_SUPABASE_URL) {
    return 'supabase'
  }
  return 'local'
}

export function getSafeRedirectTo(value: null | string | undefined) {
  if (!value || !value.startsWith('/') || value.startsWith('//') || value.includes('\\')) {
    return defaultRedirectTo
  }
  const baseUrl = new URL('https://retroassembly.invalid')
  const redirectUrl = new URL(value, baseUrl)
  if (redirectUrl.origin !== baseUrl.origin) {
    return defaultRedirectTo
  }
  return `${redirectUrl.pathname}${redirectUrl.search}${redirectUrl.hash}`
}
