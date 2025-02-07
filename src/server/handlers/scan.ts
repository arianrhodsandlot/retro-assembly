import type { Context } from 'hono'
import { ok } from '../utils.ts'

export function scan(c: Context) {
  // retroassembly_rom
  // id name user_id platform_id info
  // fs.traverse(process.env.romDir, (file) => {
  //   a
  // })
  return ok(c)
}
