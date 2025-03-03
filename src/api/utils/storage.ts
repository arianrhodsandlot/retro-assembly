import { getC } from '../../utils/misc.ts'

export async function getFileResponse(fileId: string) {
  const c = getC()
  const storage = c.get('storage')

  const object = await storage.get(fileId)
  if (!object) {
    return c.body('file not found', 404)
  }

  const headers = new Headers()
  // this may fail when using miniflare
  try {
    object.writeHttpMetadata(headers)
  } catch {}
  headers.set('ETag', object.httpEtag)
  if (object.range && 'offset' in object.range && 'end' in object.range) {
    const contentRange = `bytes ${object.range.offset}-${object.range.end ?? object.size - 1}/${object.size}`
    headers.set('Content-Range', contentRange)
  }
  let status = 304
  if (object.body) {
    status = headers.get('Range') ? 206 : 200
  }
  return new Response(object.body, { headers, status })
}
