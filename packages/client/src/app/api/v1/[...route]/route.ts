import { app as api } from '@retroassembly/server'
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono()

app.route('/api/v1/', api)

const handler = handle(app)

export { handler as GET }
export { handler as POST }
export { handler as PUT }
export { handler as PATCH }
export { handler as DELETE }
export { handler as HEAD }
export { handler as OPTIONS }

export const dynamic = 'force-dynamic'
