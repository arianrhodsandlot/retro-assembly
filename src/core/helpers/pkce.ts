import { map, range, sample } from 'lodash-es'

/** Generate a PKCE challenge verifier
 * @param length - Length of the verifier
 * @returns A random verifier `length` characters long
 */
function generateVerifier(length: number): string {
  const mask = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~'
  return map(range(length), () => sample(mask)).join('')
}

/** Generate a PKCE code challenge from a code verifier
 * @param codeVerifier - The code verifier string
 * @returns The base64 url encoded code challenge
 */
async function generateChallenge(codeVerifier: string) {
  if (!globalThis.crypto?.subtle?.digest) {
    return codeVerifier
  }

  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier))
  // Generate base64url string
  // btoa is deprecated in Node.js but is used here for web browser compatibility
  // (which has no good replacement yet, see also https://github.com/whatwg/html/issues/6811)
  return btoa(String.fromCodePoint(...new Uint8Array(buffer)))
    .replaceAll('/', '_')
    .replaceAll('+', '-')
    .replaceAll('=', '')
}

/** Generate a PKCE challenge pair
 * @param length - Length of the verifer (between 43-128). Defaults to 43.
 * @returns PKCE challenge pair
 */
export async function generatePKCEChallenge(length?: number) {
  if (!length) {
    length = 80
  }

  if (length < 43 || length > 128) {
    throw new Error(`Expected a length between 43 and 128. Received ${length}.`)
  }

  const verifier = generateVerifier(length)
  const challenge = await generateChallenge(verifier)

  return {
    codeChallenge: challenge,
    codeVerifier: verifier,
    method: verifier === challenge ? 'plain' : 'S256',
  }
}
