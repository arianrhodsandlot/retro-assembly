import { Operator } from 'opendal'
import { createClient } from 'supabase/examples/user-management/nextjs-user-management/utils/supabase/server.ts'
import { DataService } from './classes/data-service.ts'
import { validateProviderToken } from './provider-token.ts'

export async function getRequestContext() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data.user) {
    throw new Error('Failed to get user')
  }

  let { user } = data
  const service = new DataService({ supabase, user })

  if (!user.user_metadata.provider_credentials) {
    throw new Error('need login')
  }

  const { credentials, valid } = await validateProviderToken(
    user.app_metadata.provider,
    user.user_metadata.provider_credentials,
  )
  if (valid) {
    if (credentials) {
      const { data } = await supabase.auth.updateUser({ data: { provider_credentials: credentials } })
      if (data.user) {
        user = data.user
      }
    }
  } else {
    throw new Error('need login')
  }

  const accessToken = user.user_metadata.provider_credentials.access_token
  const op = new Operator('gdrive', { access_token: accessToken })

  return { op, service, user }
}
