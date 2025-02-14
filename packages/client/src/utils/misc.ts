import { headers } from 'next/headers'

async function getSiteOrigin() {
  const headersList = await headers()
  const protocol = headersList.get('x-forwarded-proto') || 'http'
  const host = headersList.get('x-forwarded-host') || headersList.get('host')
  return `${protocol}://${host}`
}

export async function resolveSiteAbsoluteUrl(path: string) {
  const siteOrigin = await getSiteOrigin()
  return new URL(path, siteOrigin).href
}
