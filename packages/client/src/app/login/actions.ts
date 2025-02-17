'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server.ts'
import { resolveSiteAbsoluteUrl } from '../../utils/misc'

export async function getLoginUrl(formData: FormData) {
  const supabase = await createClient()

  const currentUrl = await resolveSiteAbsoluteUrl('login/callback')
  const oauthRedirectToURL = new URL(currentUrl)
  const redirectTo = formData.get('redirect_to')

  if (redirectTo) {
    oauthRedirectToURL.searchParams.set('redirect_to', redirectTo.toString())
  }

  const provider = 'google' as const

  const scopes = {
    google: ['https://www.googleapis.com/auth/drive.appfolder', 'https://www.googleapis.com/auth/drive.file'].join(' '),
  }[provider as string]

  const queryParams = {
    google: { access_type: 'offline', prompt: 'consent' },
  }[provider as string]

  const { data } = await supabase.auth.signInWithOAuth({
    options: { queryParams, redirectTo: oauthRedirectToURL.href, scopes },
    provider,
  })

  if (data.url) {
    redirect(data.url)
  }
}
