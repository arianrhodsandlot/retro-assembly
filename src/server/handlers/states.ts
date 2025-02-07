import type { Context } from 'hono'
import { ok } from '../utils.ts'

export function states(c: Context) {
  const rom = c.req.queries('rom')

  return ok(c, {
    rom: { id: rom },
    states: [],
  })
}
