import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from './utils/session.ts'

export async function middleware(request: NextRequest) {
  const loginPages = ['/login', '/login/callback']
  const isLoginPage = loginPages.includes(request.nextUrl.pathname)

  if (isLoginPage) {
    return NextResponse.next({ request })
  }

  return await updateSession(request)
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
