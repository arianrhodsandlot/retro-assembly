import { google } from 'googleapis'

interface ProviderCredentials {
  access_token: string
  refresh_token: string
}

async function validateGoogleToken(credentials: ProviderCredentials) {
  try {
    const oauth2 = new google.auth.OAuth2()
    oauth2.credentials = credentials
    await oauth2.getTokenInfo(credentials.access_token)
  } catch (error) {
    if (error?.message === 'invalid_token') {
      const oauth2 = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
      oauth2.credentials = credentials
      try {
        const response = await oauth2.refreshAccessToken()
        const newCredentials: ProviderCredentials = {
          access_token: response.credentials.access_token,
          refresh_token: response.credentials.refresh_token,
        }
        return { credentials: newCredentials, valid: true }
      } catch (error) {
        console.info('refresh provider token failed', error)
        return { credentials: null, valid: false }
      }
    }
  }
  return { credentials: null, valid: true }
}

export function validateProviderToken(provider: string, credentials: ProviderCredentials) {
  if (provider === 'google') {
    return validateGoogleToken(credentials)
  }
  return { credentials: null, valid: false }
}
