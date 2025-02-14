import { redirect } from 'next/navigation'
import type { NextRequest } from 'next/server'
import { createClient } from 'supabase/examples/user-management/nextjs-user-management/utils/supabase/server.ts'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const redirectTo = searchParams.get('redirect_to')

  if (!code) {
    redirect(redirectTo || '/login')
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    redirect('/login')
  } else if (data) {
    redirect(redirectTo || '/')
  }
}
