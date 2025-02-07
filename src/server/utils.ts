import type { Context } from 'hono'
import type { ContentfulStatusCode } from 'hono/utils/http-status'

function makeJSONResponse(
  c: Context,
  { code = 0, data = null, message = 'ok' }: { code?: number; data?: unknown; message?: string } = {},
  status: ContentfulStatusCode = 200,
) {
  return c.json(
    {
      code,
      data,
      message,
      requestId: c.get('requestId'),
    },
    status,
  )
}

export function ok(c: Context, data: unknown = null) {
  return makeJSONResponse(c, { data })
}

export function raise(
  c: Context,
  { code = 1, data, message = 'error' }: { code?: number; data?: unknown; message?: string } = {},
  status: ContentfulStatusCode = 400,
) {
  return makeJSONResponse(c, { code, data, message }, status)
}
