import type { NextRequest } from 'next/server'
import { updateSession as updateSupabaseSession } from '@/utils/supabase/middleware.ts'

export async function updateSession(request: NextRequest) {
  const response = await updateSupabaseSession(request)
  return response
}
