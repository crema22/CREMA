export type Product = {
  id: string
  name: string
  slug: string
  short_description: string
  long_description: string
  main_image_url: string
  gallery_images: string[]
  regular_price: number
  clubhouse_price: number
  sku: string
  category: string
  featured: boolean
  active: boolean
  display_order: number
  shipping_estimate: string
  processing_time: string
  created_at: string
  updated_at: string
}

// Private commerce fields live in the server-only `product_commerce`
// table and are never exposed to the browser. See migration-01.
export type ProductCommerce = {
  product_id: string
  regular_checkout_id: string | null
  clubhouse_checkout_id: string | null
  cj_sku: string | null
}

export type CustomerProfile = {
  id: string
  user_id: string
  email: string
  whop_user_id: string | null
  whop_membership_id: string | null
  membership_status: 'active' | 'trialing' | 'inactive' | null
  renewal_date: string | null
  created_at: string
  updated_at: string
}

export type Order = {
  id: string
  user_id: string
  whop_payment_id: string | null
  whop_customer_id: string | null
  product_id: string
  sku: string
  transaction_type: 'physical_regular' | 'physical_clubhouse' | 'membership_initial' | 'membership_renewal'
  amount: number
  affiliate_id: string | null
  membership_id: string | null
  membership_status: string | null
  cj_order_id: string | null
  tracking_number: string | null
  delivery_status: string | null
  refund_status: string | null
  created_at: string
  updated_at: string
}

export type MembershipStatus = {
  clubhouse: boolean
  status: 'active' | 'trialing' | 'inactive' | 'not_configured'
  renewalDate: string | null
}
