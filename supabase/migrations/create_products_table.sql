-- Create products table if not exists
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  image_url TEXT,
  category TEXT,
  weight TEXT,
  discount INT DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 4.5,
  review_count INT DEFAULT 0,
  badge TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read policy
CREATE POLICY "products_read_public" ON products FOR SELECT USING (true);

-- Admin insert/update policy (you can modify this based on your admin setup)
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (true);

-- Create index
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
