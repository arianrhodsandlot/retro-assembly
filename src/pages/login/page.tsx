import { getContextData } from 'waku/middleware/context'
import { getC } from '@/utils/misc.ts'
import { LoginForm } from './components/login-form.tsx'

export async function LoginPage({ query }) {
  const searchParams = new URLSearchParams(query)
  const redirectTo = searchParams.get('redirect_to') ?? '/app'
  const code = searchParams.get('code')
  const c = getC()
  const { redirect } = getContextData()

  const supabase = c.get('supabase')
  if (!supabase) {
    return redirect('/')
  }

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      return <div>{error.message}</div>
    }
    if (data) {
      return redirect(redirectTo)
    }
  }

  if (redirectTo) {
    return <LoginForm redirectTo={redirectTo} />
  }
}
