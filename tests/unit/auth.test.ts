import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { getSafeRedirectTo, resolveAuthMode } from '#@/constants/auth.ts'
import { getOidcUsernameAndRoles } from '#@/utils/server/oidc.ts'

await describe('authentication helpers', async () => {
  await it('accepts only application-relative redirects', () => {
    assert.equal(getSafeRedirectTo('/library/roms?sort=name'), '/library/roms?sort=name')
    assert.equal(getSafeRedirectTo('https://example.com'), '/library')
    assert.equal(getSafeRedirectTo('//example.com'), '/library')
    assert.equal(getSafeRedirectTo(String.raw`/\example.com`), '/library')
    assert.equal(getSafeRedirectTo(undefined), '/library')
  })

  await it('selects authentication by deployment configuration', () => {
    assert.equal(resolveAuthMode({}, 'node'), 'local')
    assert.equal(
      resolveAuthMode(
        {
          RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: 'key',
          RETROASSEMBLY_RUN_TIME_SUPABASE_URL: 'https://supabase.example',
        },
        'workerd',
      ),
      'supabase',
    )
    assert.equal(
      resolveAuthMode(
        {
          RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID: 'retroassembly',
          RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET: 'secret',
          RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example',
          RETROASSEMBLY_RUN_TIME_OIDC_REQUIRED_ROLE: 'retroassembly',
        },
        'node',
      ),
      'oidc',
    )
  })

  await it('rejects incomplete, conflicting, and Workers OIDC configuration', () => {
    const oidc = {
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID: 'retroassembly',
      RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET: 'secret',
      RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example',
      RETROASSEMBLY_RUN_TIME_OIDC_REQUIRED_ROLE: 'retroassembly',
    }
    assert.throws(() => resolveAuthMode({ RETROASSEMBLY_RUN_TIME_OIDC_ISSUER: 'https://id.example' }, 'node'))
    assert.throws(() => resolveAuthMode(oidc, 'workerd'))
    assert.throws(() =>
      resolveAuthMode(
        {
          ...oidc,
          RETROASSEMBLY_RUN_TIME_SUPABASE_ANON_KEY: 'key',
          RETROASSEMBLY_RUN_TIME_SUPABASE_URL: 'https://supabase.example',
        },
        'node',
      ),
    )
  })

  await it('reads Pocket ID usernames and role arrays', () => {
    assert.deepEqual(getOidcUsernameAndRoles({ preferred_username: ' arcade ', roles: ['retroassembly', 'other'] }), {
      roles: ['retroassembly', 'other'],
      username: 'arcade',
    })
  })

  await it('normalizes a single Pocket ID role', () => {
    assert.deepEqual(getOidcUsernameAndRoles({ preferred_username: 'arcade', roles: 'retroassembly' }), {
      roles: ['retroassembly'],
      username: 'arcade',
    })
  })

  await it('rejects missing identity claims', () => {
    assert.throws(() => getOidcUsernameAndRoles({ roles: ['retroassembly'] }))
    assert.throws(() => getOidcUsernameAndRoles({ preferred_username: 'arcade' }))
    assert.throws(() => getOidcUsernameAndRoles({ preferred_username: 'arcade', roles: [1] }))
  })
})
