import { getContext } from 'hono/context-storage'
import { setCookie } from 'hono/cookie'

export function isSecureRequest() {
  const c = getContext()
  const forwardedProtocol = c.req.header('X-Forwarded-Proto')?.split(',')[0]?.trim()
  return new URL(c.req.url).protocol === 'https:' || forwardedProtocol === 'https'
}

export function setSessionCookie(token: string, expires: Date, secure = isSecureRequest()) {
  const c = getContext()
  setCookie(c, 'token', token, {
    expires,
    httpOnly: true,
    path: '/',
    sameSite: 'Strict',
    secure,
  })
}
