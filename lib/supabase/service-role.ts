import { createClient } from '@supabase/supabase-js'

/**
 * SECURITY: This client uses the SERVICE_ROLE_KEY and must NEVER be exposed to the browser.
 * Use only in server-side code for privileged operations:
 * - Creating/updating orders from webhooks
 * - Updating customer membership status
 * - Admin operations
 * 
 * Never use in API routes that could be called from the browser without proper auth verification.
 */
export function createServiceRoleClient() {
  // Hard guard: this must never execute in a browser bundle.
  if (typeof window !== 'undefined') {
    throw new Error(
      'createServiceRoleClient() was called in the browser. This client bypasses ' +
        'all RLS and must only ever run server-side.'
    )
  }

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
