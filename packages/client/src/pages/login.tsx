import { getContextData } from 'waku/middleware/context'
import { LoginForm } from '../components/login/login-form.tsx'

export default async function Login({ query }) {
  const searchParams = new URLSearchParams(query)
  const redirectTo = searchParams.get('redirect_to') ?? '/app'
  const code = searchParams.get('code')
  const { redirect, supabase } = getContextData()

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
