import type { HandlerContext } from 'waku/server'

export function getControllers(ctx: HandlerContext) {
  return {
    auth: auth(ctx),
  }
}
