import { Hono } from 'hono'
import { supabase } from '../../middlewares/supabase.ts'

const auth = new Hono()

auth.use(supabase())

export { auth }
