import { requestLocalHandle } from '../helpers/file'

export async function grantLocalPermission() {
  return await requestLocalHandle({ name: 'rom', mode: 'readwrite' })
}
