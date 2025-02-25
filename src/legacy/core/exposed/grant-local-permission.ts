import { requestLocalHandle } from '../helpers/file'

export async function grantLocalPermission() {
  return await requestLocalHandle({ mode: 'readwrite', name: 'rom' })
}
