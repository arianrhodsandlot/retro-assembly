import { getContext } from 'hono/context-storage'
import { getAuthMode, getSafeRedirectTo } from '#@/constants/auth.ts'
import { countUsers } from '#@/controllers/users/count-users.ts'
import { LoginPage } from '../login/page.tsx'
import type { Route } from './+types/login.ts'

export async function loader({ request }: Route.LoaderArgs) {
  const c = getContext()
  const { currentUser, supabase, t } = c.var
  const { searchParams } = new URL(request.url)
  const redirectTo = getSafeRedirectTo(searchParams.get('redirect_to'))

  if (currentUser) {
    throw c.redirect(redirectTo)
  }

  const authMode = getAuthMode()
  if (authMode === 'oidc') {
    const errorCode = searchParams.get('error')
    const error = errorCode ? { message: t(`auth.${errorCode}`) } : undefined
    return { error, formType: 'oidc' as const, redirectTo, title: t('auth.login') }
  }

  if (authMode === 'supabase' && supabase) {
    const formType = 'oauth'
    const code = searchParams.get('code')
    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          return { error, formType, redirectTo, title: t('auth.login') }
        }
      } catch (error: any) {
        return { error, formType, redirectTo, title: t('auth.login') }
      }

      throw c.redirect(redirectTo)
    }

    return { formType, redirectTo, title: t('auth.login') }
  }

  const userCount = await countUsers()
  const formType = userCount ? 'login' : 'register'
  return { formType, redirectTo, title: t('auth.login') }
}

export default function LoginRoute() {
  return <LoginPage />
}
