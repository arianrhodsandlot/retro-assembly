import type { Context } from 'hono'

export async function platforms(c: Context) {
  try {
    // await c.var.op.createDir('/retroassembly/nes/')
    // await c.var.op.createDir('/retroassembly/snes/')
    // await c.var.op.createDir('/retroassembly/megadrive/')
    const entries = await c.var.op.list('/retroassembly/')
    const platforms = entries.map((entry) => entry.path())
    return c.var.ok({ platforms })
  } catch (error) {
    console.error(error)
    return c.var.error(error)
  }
}
