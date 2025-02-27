import { getContextData } from 'waku/middleware/context'
import { LoginForm } from '../components/login/login-form.tsx'
import { getC } from '../utils/misc.ts'

export default async function Login({ query }) {
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
