import type { UserMetadata } from '@supabase/supabase-js'
import { merge } from 'es-toolkit'
import type { Context, Next } from 'hono'

const defaultInputMap = {}

const defaultPreference = {
  biosDirectory: '/system',
  inputMap: defaultInputMap,
  internalDirectory: '/internal',
  language: 'auto',
  legacyInternalDirectory: '/retro-assembly',
  romsDirectory: '/',
  rootDirectory: '/retroassembly',
}

declare module '@supabase/supabase-js' {
  interface UserMetadata {
    preference?: typeof defaultPreference
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    preference: typeof defaultPreference
    userMetadata: UserMetadata
  }
}

export function userMetadata() {
  return async (c: Context, next: Next) => {
    const user = c.get('user')
    const preference = merge(structuredClone(user.user_metadata.preference || {}), defaultPreference)

    c.set('userMetadata', user.user_metadata)
    c.set('preference', preference)

    await next()
  }
}
