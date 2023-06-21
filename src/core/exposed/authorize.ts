import { getAuthorizeUrl } from './get-authorize-url'

export function authorize(type: 'onedrive' | 'google-drive') {
  const authorizeUrl = getAuthorizeUrl(type)
  return open(authorizeUrl)
}
