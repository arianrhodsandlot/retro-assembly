import type { Context, Next } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

declare module 'hono' {
  interface ContextVariableMap {
    error: ReturnType<typeof error>
    ok: ReturnType<typeof ok>
  }
}

function makeJSONResponse(
  c: Context,
  data: { code?: number; data: unknown; message?: string } | object = {},
  status: ContentfulStatusCode = 200,
) {
  if ('data' in data) {
    return c.json(
      {
        code: data.code || 0,
        data: data.data ?? null,
        message: data.message ?? '',
        requestId: c.get('requestId'),
      },
      status,
    )
  }
  return makeJSONResponse(c, { data }, status)
}

function ok(c: Context) {
  return (data: { code?: number; data: unknown; message?: string } | object = {}) => makeJSONResponse(c, { data })
}

function error(c: Context) {
  return (
    data: { code?: number; data?: unknown; message?: string } | Error = {},
    status: ContentfulStatusCode = 400,
  ) => {
    if (data instanceof Error) {
      return makeJSONResponse(c, { code: 1, data: null, message: data.message }, status)
    }
    return makeJSONResponse(c, { code: data.code || 1, data: data.data ?? null, message: data.message }, status)
  }
}

export function okError() {
  return async (c: Context, next: Next) => {
    c.set('ok', ok(c))
    c.set('error', error(c))
    await next()
  }
}
