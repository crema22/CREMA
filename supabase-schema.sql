-- ============================================================================
-- CREMA CLUBHOUSE - PRODUCTION SCHEMA WITH SECURITY HARDENING
-- ============================================================================

-- ============================================================================
-- 1. PRODUCTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT NOT NULL,
  long_description TEXT,
  main_image_url TEXT DEFAULT 'https://via.placeholder.com/500x500?text=Product+Image+Coming+Soon',
  gallery_images TEXT[] DEFAULT ARRAY[]::TEXT[],
  regular_price DECIMAL(10, 2) NOT NULL,
  clubhouse_price DECIMAL(10, 2) NOT NULL,
  sku TEXT,
  cj_sku TEXT,
  category TEXT DEFAULT 'Coffee Gear',
  featured BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 999,
  shipping_estimate TEXT DEFAULT 'Shipping details coming soon',
  processing_time TEXT DEFAULT 'Processing details coming soon',
  regular_checkout_id TEXT,
  clubhouse_checkout_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);

-- ============================================================================
-- 2. CUSTOMER PROFILES TABLE
-- Maps Supabase users to Whop membership state
-- ============================================================================
CREATE TABLE IF NOT EXISTS customer_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  whop_user_id TEXT,
  whop_membership_id TEXT,
  membership_status TEXT DEFAULT 'inactive' CHECK (membership_status IN ('active', 'trialing', 'inactive')),
  renewal_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_customer_profiles_user_id ON customer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_whop_user_id ON customer_profiles(whop_user_id);

-- ============================================================================
-- 3. ORDERS TABLE
-- Created server-side only, via webhooks. Users cannot INSERT directly.
-- ============================================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  whop_payment_id TEXT,
  whop_customer_id TEXT,
  product_id UUID REFERENCES products(id),
  sku TEXT,
  transaction_type TEXT CHECK (transaction_type IN ('physical_regular', 'physical_clubhouse', 'membership_initial', 'membership_renewal')),
  amount DECIMAL(10, 2) NOT NULL,
  affiliate_id TEXT,
  membership_id TEXT,
  membership_status TEXT,
  cj_order_id TEXT,
  tracking_number TEXT,
  delivery_status TEXT,
  refund_status TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_whop_customer_id ON orders(whop_customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON orders(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_whop_payment_id ON orders(whop_payment_id);

-- ============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- PRODUCTS: Allow anyone to read active products
CREATE POLICY "Allow public read of active products" ON products
  FOR SELECT USING (active = true);

-- CUSTOMER_PROFILES: Users can read their own profile
CREATE POLICY "Users can read own profile" ON customer_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- CUSTOMER_PROFILES: Only service role can update profiles (via webhooks)
-- No direct user INSERT/UPDATE/DELETE allowed
CREATE POLICY "Service role can manage profiles" ON customer_profiles
  FOR ALL USING (auth.role() = 'service_role');

-- ORDERS: Users can read their own orders only
CREATE POLICY "Users can read own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- ORDERS: No direct user INSERT/UPDATE/DELETE
-- Orders created via service role from verified Whop webhooks only
CREATE POLICY "Service role can manage orders" ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- 5. SEED DATA - NEUTRAL PRODUCT DESCRIPTIONS
-- ============================================================================

INSERT INTO products (name, slug, short_description, long_description, regular_price, clubhouse_price, sku, category, featured, display_order) VALUES
(
  'USB-C Milk Frother',
  'usb-c-milk-frother',
  'Compact rechargeable frother.',
  'Product specifications will be updated after final supplier selection.',
  29.99,
  9.99,
  'FROTH-USB-001',
  'Coffee Gear',
  true,
  1
),
(
  'Espresso Scale',
  'espresso-scale',
  'Precision digital scale for dosing.',
  'Product specifications will be updated after final supplier selection.',
  39.99,
  14.99,
  'SCALE-DIGIT-001',
  'Coffee Gear',
  true,
  2
),
(
  'WDT Tool',
  'wdt-tool',
  'Needle tool for espresso puck preparation.',
  'Product specifications will be updated after final supplier selection.',
  24.99,
  8.99,
  'WDT-NEEDLE-001',
  'Coffee Gear',
  true,
  3
),
(
  'Puck Screen',
  'puck-screen',
  'Metal screen for espresso basket.',
  'Product specifications will be updated after final supplier selection.',
  19.99,
  6.99,
  'PUCK-SCREEN-001',
  'Coffee Gear',
  false,
  4
),
(
  'Dosing Cup',
  'dosing-cup',
  'Portafilter-compatible dosing cup.',
  'Product specifications will be updated after final supplier selection.',
  21.99,
  7.99,
  'DOSE-CUP-001',
  'Coffee Gear',
  false,
  5
),
(
  'Tamping Mat',
  'tamping-mat',
  'Non-slip mat for espresso tamping.',
  'Product specifications will be updated after final supplier selection.',
  24.99,
  9.99,
  'TAMP-MAT-001',
  'Coffee Gear',
  false,
  6
),
(
  'Milk Pitcher',
  'milk-pitcher',
  'Stainless steel pitcher for milk steaming.',
  'Product specifications will be updated after final supplier selection.',
  29.99,
  12.99,
  'PITCH-MILK-001',
  'Coffee Gear',
  false,
  7
),
(
  'Knock Box',
  'knock-box',
  'Compact knock box for espresso grounds disposal.',
  'Product specifications will be updated after final supplier selection.',
  34.99,
  14.99,
  'KNOCK-BOX-001',
  'Coffee Gear',
  false,
  8
),
(
  'Cleaning Brush',
  'cleaning-brush',
  'Soft-bristle brush for espresso machine maintenance.',
  'Product specifications will be updated after final supplier selection.',
  14.99,
  5.99,
  'BRUSH-CLEAN-001',
  'Coffee Gear',
  false,
  9
),
(
  'Espresso Tamper',
  'espresso-tamper',
  'Weighted tamper for consistent espresso pressure.',
  'Product specifications will be updated after final supplier selection.',
  19.99,
  7.99,
  'TAMP-PRESS-001',
  'Coffee Gear',
  false,
  10
) ON CONFLICT (slug) DO NOTHING;
