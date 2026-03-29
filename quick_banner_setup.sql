-- Quick Banner Restore Script
-- Run this in Supabase SQL Editor to restore banner functionality

-- Create banners table
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

-- Enable RLS
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active banners"
  ON banners FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage banners"
  ON banners FOR ALL
  USING (auth.role() = 'authenticated');

-- Insert Active Banner (Always visible)
INSERT INTO banners (
  title,
  subtitle,
  description,
  badge_text,
  button_text,
  background_gradient,
  icon_emoji,
  is_active,
  display_order
) VALUES (
  'Fresh Flowers Daily',
  'Divine Blooms for Your Daily Puja',
  'Fresh Daily • Puja Ready • Premium Quality • Free Delivery',
  '✨ SPECIAL OFFER',
  'Shop Now →',
  'from-orange-600 via-pink-600 to-red-600',
  '🌺',
  true,
  1
) ON CONFLICT DO NOTHING;

-- Success message
SELECT 'Banner table created successfully! Visit your home page to see the banner.' as message;
