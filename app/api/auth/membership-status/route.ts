export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MembershipStatus } from '@/lib/supabase/types'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      const response: MembershipStatus = {
        clubhouse: false,
        status: 'not_configured',
        renewalDate: null,
      }
      return NextResponse.json(response)
    }

    const { data: profile, error: profileError } = await supabase
      .from('customer_profiles')
      .select('membership_status, renewal_date')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      const response: MembershipStatus = {
        clubhouse: false,
        status: 'inactive',
        renewalDate: null,
      }
      return NextResponse.json(response)
    }

    const isActive = profile.membership_status === 'active' || profile.membership_status === 'trialing'

    const response: MembershipStatus = {
      clubhouse: isActive,
      status: (profile.membership_status as 'active' | 'trialing' | 'inactive') || 'inactive',
      renewalDate: profile.renewal_date,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Membership status error:', error)
    return NextResponse.json(
      {
        clubhouse: false,
        status: 'not_configured',
        renewalDate: null,
      },
      { status: 200 }
    )
  }
}