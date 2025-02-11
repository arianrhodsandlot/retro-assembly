import { Hono } from 'hono'
import { okError } from '../../middlewares/ok-error.ts'
import { supabase } from '../../middlewares/supabase.ts'

const auth = new Hono()

auth.use(supabase(), okError())

export { auth }
