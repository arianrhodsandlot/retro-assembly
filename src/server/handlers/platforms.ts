import type { Context } from 'hono'

export async function platforms(c: Context) {
  try {
    const files = await c.var.fs.list('/retroassembly')
    return c.var.ok(files)
  } catch {
    return c.var.ok([])
  }
}
