-- Create banners table for dynamic home page banners
CREATE TABLE IF NOT EXISTS banners (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255),
  description TEXT,
  badge_text VARCHAR(100),
  button_text VARCHAR(100) DEFAULT 'Shop Now',
  background_gradient VARCHAR(255) DEFAULT 'from-red-600 via-orange-500 to-yellow-500',
  icon_emoji VARCHAR(50) DEFAULT '🔱',
  is_active BOOLEAN DEFAULT true,
  start_date DATE,
  end_date DATE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active banners
CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true AND (start_date IS NULL OR start_date <= CURRENT_DATE) AND (end_date IS NULL OR end_date >= CURRENT_DATE));

-- Only authenticated users can insert/update/delete (admins)
CREATE POLICY "Authenticated users can manage banners"
  ON banners FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert default Navratri banner
INSERT INTO banners (
  title,
  subtitle,
  description,
  badge_text,
  button_text,
  background_gradient,
  icon_emoji,
  is_active,
  start_date,
  end_date,
  display_order
) VALUES (
  'Navratri',
  'Divine Flowers for 9 Sacred Nights',
  'Fresh Daily • Puja Ready • 9 Days Plan',
  'NAVRATRI CELEBRATION',
  'Shop Navratri Flowers →',
  'from-red-600 via-orange-500 to-yellow-500',
  '🔱',
  true,
  '2024-10-01',
  '2024-10-15',
  1
);

-- Example: Diwali banner (inactive by default)
INSERT INTO banners (
  title,
  subtitle,
  description,
  badge_text,
  button_text,
  background_gradient,
  icon_emoji,
  is_active,
  start_date,
  end_date,
  display_order
) VALUES (
  'Diwali',
  'Festival of Lights Special',
  'Fresh Flowers • Puja Thali • Special Offers',
  'DIWALI SPECIAL',
  'Shop Diwali Collection →',
  'from-yellow-600 via-orange-500 to-red-600',
  '🪔',
  false,
  '2024-10-20',
  '2024-11-05',
  2
);

-- Example: Holi banner (inactive by default)
INSERT INTO banners (
  title,
  subtitle,
  description,
  badge_text,
  button_text,
  background_gradient,
  icon_emoji,
  is_active,
  start_date,
  end_date,
  display_order
) VALUES (
  'Holi',
  'Colors of Joy & Fresh Flowers',
  'Vibrant Flowers • Special Combos • Festival Ready',
  'HOLI CELEBRATION',
  'Shop Holi Flowers →',
  'from-pink-600 via-purple-500 to-blue-600',
  '🎨',
  false,
  '2025-03-10',
  '2025-03-20',
  3
);

COMMENT ON TABLE banners IS 'Dynamic banners for home page - festivals, offers, promotions';
