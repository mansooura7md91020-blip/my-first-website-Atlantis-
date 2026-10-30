-- Atlantis phase 2: execute ONCE in Supabase SQL Editor as project owner.
-- Existing products/categories/admin_users tables are NOT overwritten.
ALTER TABLE public.company_settings
  ADD COLUMN IF NOT EXISTS facebook_url text,
  ADD COLUMN IF NOT EXISTS catalog_live boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shipping_note_ar text,
  ADD COLUMN IF NOT EXISTS shipping_note_en text;

CREATE TABLE IF NOT EXISTS public.shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ar text NOT NULL,
  name_en text NOT NULL,
  fee numeric(12,2) CHECK (fee IS NULL OR fee >= 0),
  quote_only boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL CHECK (length(customer_name) BETWEEN 2 AND 180),
  phone text NOT NULL CHECK (length(phone) BETWEEN 6 AND 40),
  email text,
  delivery_address text NOT NULL CHECK (length(delivery_address) BETWEEN 4 AND 600),
  shipping_zone_id uuid REFERENCES public.shipping_zones(id) ON DELETE SET NULL,
  shipping_zone_name text,
  shipping_fee numeric(12,2),
  items jsonb NOT NULL,
  subtotal numeric(12,2),
  total numeric(12,2),
  notes text,
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received','confirmed','preparing','out_for_delivery','delivered','cancelled')),
  payment_terms text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.supply_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  organization_name text NOT NULL,
  organization_type text NOT NULL DEFAULT 'other',
  phone text NOT NULL,
  email text,
  products_needed text NOT NULL,
  delivery_location text NOT NULL,
  requested_delivery_date date,
  notes text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','reviewing','quoted','accepted','declined')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.supply_requests
  ADD COLUMN IF NOT EXISTS quoted_amount numeric(12,2) CHECK (quoted_amount IS NULL OR quoted_amount >= 0),
  ADD COLUMN IF NOT EXISTS quoted_details text,
  ADD COLUMN IF NOT EXISTS quoted_valid_until date,
  ADD COLUMN IF NOT EXISTS payment_terms text,
  ADD COLUMN IF NOT EXISTS delivery_terms text;

-- Explicit API privileges: RLS remains the real authorization layer.
GRANT SELECT ON public.shipping_zones TO anon, authenticated;
GRANT INSERT ON public.orders, public.supply_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders, public.supply_requests, public.shipping_zones TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.company_settings TO authenticated;
GRANT SELECT ON public.company_settings TO anon;

ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supply_requests ENABLE ROW LEVEL SECURITY;

-- Public can only read active shipping options. No direct public order access.
DROP POLICY IF EXISTS "Public active shipping zones" ON public.shipping_zones;
CREATE POLICY "Public active shipping zones" ON public.shipping_zones FOR SELECT TO anon, authenticated USING (is_active = true);

-- Admin reads all, including inactive rows, and may create/update/delete.
DROP POLICY IF EXISTS "Admin shipping CRUD" ON public.shipping_zones;
CREATE POLICY "Admin shipping CRUD" ON public.shipping_zones FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Admin orders CRUD" ON public.orders;
CREATE POLICY "Admin orders CRUD" ON public.orders FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

DROP POLICY IF EXISTS "Admin supply request CRUD" ON public.supply_requests;
CREATE POLICY "Admin supply request CRUD" ON public.supply_requests FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())))
  WITH CHECK (EXISTS (SELECT 1 FROM public.admin_users a WHERE a.user_id = (SELECT auth.uid())));

-- Public may submit new orders/requests but cannot read them or change status.
-- Default field values and check constraints enforce initial states.
DROP POLICY IF EXISTS "Public submit orders" ON public.orders;
CREATE POLICY "Public submit orders" ON public.orders FOR INSERT TO anon
  WITH CHECK (status = 'received' AND payment_terms IS NULL);
DROP POLICY IF EXISTS "Public submit supply requests" ON public.supply_requests;
CREATE POLICY "Public submit supply requests" ON public.supply_requests FOR INSERT TO anon
  WITH CHECK (status = 'new');

-- Link existing company settings to the confirmed Atlantis Facebook page.
INSERT INTO public.company_settings (id, facebook_url)
VALUES (1, 'https://www.facebook.com/profile.php?id=61595681892099&locale=ar_AR')
ON CONFLICT (id) DO UPDATE SET facebook_url = EXCLUDED.facebook_url;

-- If the SQL Editor returns 'Success', open Table Editor > shipping_zones.
-- Do NOT manually paste secret keys into the project or this SQL file.
