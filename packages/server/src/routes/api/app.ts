import { Hono } from 'hono'
import { okError } from '../../middlewares/ok-error.ts'
import { session } from '../../middlewares/session.ts'
import { supabase } from '../../middlewares/supabase.ts'
import { userMetadata } from '../../middlewares/user-metadata.ts'

const api = new Hono()

api.use(okError(), supabase(), session(), userMetadata())

export { api }
