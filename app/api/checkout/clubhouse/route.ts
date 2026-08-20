export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * POST /api/checkout/clubhouse
 *
 * Creates a Clubhouse-price checkout.
 *
 * AUTHORIZATION RULE:
 * Discounted pricing must be authorized by a LIVE Whop membership check,
 * never by customer_profiles.membership_status — that column is a display
 * cache only and can go stale after a cancellation or failed payment.
 *
 * Whop is not yet connected, so this returns a structured 503 rather than
 * pretending to authorize anyone.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)

    if (!body || typeof body.productId !== 'string' || !UUID_RE.test(body.productId)) {
      return NextResponse.json(
        { error: 'invalid_request', message: 'A valid productId is required.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, regular_price, clubhouse_price')
      .eq('id', body.productId)
      .eq('active', true)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'not_found', message: 'Product not found.' },
        { status: 404 }
      )
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // TODO(Whop): branch on a LIVE Whop membership verification.
    //
    //   if (user) {
    //     const membership = await verifyWhopMembership(user.id)   // live API call
    //     if (membership.status === 'active' || membership.status === 'trialing') {
    //       -> create checkout at product.clubhouse_price
    //          using clubhouse_checkout_id from product_commerce
    //     }
    //   }
    //   -> otherwise create the acquisition checkout:
    //      product at clubhouse_price + 14-day trial, then $39.99/month
    //
    // Do NOT read membership_status from customer_profiles to make this decision.
    void user

    return NextResponse.json(
      {
        error: 'not_configured',
        message: 'Clubhouse checkout is not available yet. Please check back soon.',
      },
      { status: 503 }
    )
  } catch {
    return NextResponse.json(
      { error: 'server_error', message: 'Checkout could not be started.' },
      { status: 500 }
    )
  }
}
