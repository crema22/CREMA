-- ============================================================================
-- MIGRATION 01 — Move private commerce fields out of the public products table
-- ============================================================================
--
-- WHY THIS IS NEEDED
--
-- RLS in Postgres is ROW-level, not COLUMN-level. The existing policy
-- "Allow public read of active products" grants SELECT on every column of
-- every active row. Your anon key is embedded in the browser bundle, so
-- anyone can query your Supabase REST endpoint directly and read
-- regular_checkout_id, clubhouse_checkout_id and cj_sku.
--
-- cj_sku in particular reveals your supplier and their exact product code,
-- which discloses your cost base and lets anyone replicate your catalogue.
--
-- Run this in the Supabase SQL Editor. Safe to run once, after the main
-- schema. Existing values are copied across before the columns are dropped.
-- ============================================================================

-- 1. Server-only table for private commerce data
CREATE TABLE IF NOT EXISTS product_commerce (
  product_id UUID PRIMARY KEY REFERENCES products(id) ON DELETE CASCADE,
  regular_checkout_id TEXT,
  clubhouse_checkout_id TEXT,
  cj_sku TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Copy any existing values across
INSERT INTO product_commerce (product_id, regular_checkout_id, clubhouse_checkout_id, cj_sku)
SELECT id, regular_checkout_id, clubhouse_checkout_id, cj_sku
FROM products
ON CONFLICT (product_id) DO NOTHING;

-- 3. Lock it down.
-- RLS is enabled with NO policies at all. This means anon and authenticated
-- roles can read nothing. The service_role key bypasses RLS entirely, so
-- server-side code can still read it — that is the only intended access path.
ALTER TABLE product_commerce ENABLE ROW LEVEL SECURITY;

-- 4. Remove the private columns from the publicly readable table
ALTER TABLE products DROP COLUMN IF EXISTS regular_checkout_id;
ALTER TABLE products DROP COLUMN IF EXISTS clubhouse_checkout_id;
ALTER TABLE products DROP COLUMN IF EXISTS cj_sku;

-- ============================================================================
-- 5. Webhook idempotency groundwork (P1 #9)
--
-- Prevents a replayed Whop webhook from creating duplicate orders.
-- A UNIQUE constraint makes duplicate inserts fail at the database level
-- rather than relying on handler logic being correct.
-- ============================================================================

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_whop_payment_id_unique
  ON orders (whop_payment_id)
  WHERE whop_payment_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL DEFAULT 'whop',
  event_id TEXT NOT NULL,
  event_type TEXT,
  payload JSONB,
  processed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (provider, event_id)
);

ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- VERIFY
--
-- After running, this should return zero rows — confirming the private
-- columns are gone from the public table:
--
--   SELECT column_name FROM information_schema.columns
--   WHERE table_name = 'products'
--     AND column_name IN ('regular_checkout_id','clubhouse_checkout_id','cj_sku');
-- ============================================================================
