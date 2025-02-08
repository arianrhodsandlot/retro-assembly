import type { Context } from 'hono'

export function states(c: Context) {
  const rom = c.req.queries('rom')

  return c.var.ok({
    rom: { id: rom },
    states: [],
  })
}
