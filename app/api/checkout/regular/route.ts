export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * POST /api/checkout/regular
 *
 * Creates a regular-price checkout.
 *
 * Whop is not yet connected, so this returns a structured 503.
 * It must never invent a checkout URL or redirect a customer anywhere.
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

    // Price is read from the database, never from the client payload.
    const { data: product, error } = await supabase
      .from('products')
      .select('id, name, regular_price')
      .eq('id', body.productId)
      .eq('active', true)
      .single()

    if (error || !product) {
      return NextResponse.json(
        { error: 'not_found', message: 'Product not found.' },
        { status: 404 }
      )
    }

    // TODO(Whop): read regular_checkout_id from the server-only
    // product_commerce table, create a Whop checkout for
    // product.regular_price, and return the real session URL.
    return NextResponse.json(
      {
        error: 'not_configured',
        message: 'Checkout is not available yet. Please check back soon.',
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
