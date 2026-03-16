-- Seed data for subscription_plans
INSERT INTO subscription_plans (name, price, description, quantity_per_day, delivery_frequency, pickup_enabled, pickup_time_start, pickup_time_end)
VALUES
  ('Daily Essentials', 999.00, 'Perfect for daily puja with 3 fresh flower choices to customize each day. Includes daily pickup of old flowers.', 3, 'Daily', true, '07:00', '09:00'),
  ('Premium Bundle', 1200.00, 'Elevate your daily worship with 4 premium flower bundle options. Fresh daily delivery with our smart pickup service.', 4, 'Daily', true, '07:00', '09:00'),
  ('Luxury Collection', 1500.00, 'The ultimate celebration bundle with 4 exclusive, premium flower selections. Perfect for special occasions and daily worship combined.', 4, 'Daily', true, '07:00', '09:00')
ON CONFLICT DO NOTHING;

-- Seed data for flower_bundles (Plan 1: Daily Essentials - ₹999/month)
INSERT INTO flower_bundles (plan_id, bundle_name, description, image_url, contents, badge, display_order)
SELECT id, 'Rose Radiance', 'Classic red roses symbolizing devotion and love. Perfect for morning prayers.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop', 'Fresh Red Roses (Qty: 12), Green Foliage', NULL, 1
FROM subscription_plans WHERE name = 'Daily Essentials'
UNION ALL
SELECT id, 'Marigold Magic', 'Vibrant yellow and orange marigolds, sacred in Hindu pujas. Brings warmth and positivity.', 'https://images.unsplash.com/photo-1599088113235-229a19af903d?w=400&h=400&fit=crop', 'Fresh Marigolds (Qty: 15), Green Leaves', 'Popular', 2
FROM subscription_plans WHERE name = 'Daily Essentials'
UNION ALL
SELECT id, 'Divine Mix', 'A harmonious blend of roses, marigolds, and fragrant jasmine for complete spiritual experience.', 'https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=400&h=400&fit=crop', 'Red Roses (8), Marigolds (10), Jasmine (5)', NULL, 3
FROM subscription_plans WHERE name = 'Daily Essentials';

-- Seed data for flower_bundles (Plan 2: Premium Bundle - ₹1200/month)
INSERT INTO flower_bundles (plan_id, bundle_name, description, image_url, contents, badge, display_order)
SELECT id, 'Premium Roses', 'Hand-picked premium red roses with premium greenery. Premium quality for dedicated devotion.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop', 'Premium Red Roses (Qty: 15), Ferns & Eucalyptus', 'Best Seller', 1
FROM subscription_plans WHERE name = 'Premium Bundle'
UNION ALL
SELECT id, 'Luxury Blend', 'Exquisite mix of premium roses, tulips, and carnations. For those who seek elegance in worship.', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop', 'Premium Roses (8), Tulips (5), Carnations (7), Fern', NULL, 2
FROM subscription_plans WHERE name = 'Premium Bundle'
UNION ALL
SELECT id, 'Festival Special', 'Marigolds, jasmine, and lilies creating a festive sacred atmosphere perfect for celebrations.', 'https://images.unsplash.com/photo-1599088113235-229a19af903d?w=400&h=400&fit=crop', 'Marigolds (12), Jasmine (6), Lilies (4)', NULL, 3
FROM subscription_plans WHERE name = 'Premium Bundle'
UNION ALL
SELECT id, 'Exotic Mix', 'Premium combination of mixed exotic flowers for the ultimate spiritual experience.', 'https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=400&h=400&fit=crop', 'Mixed Premium Flowers (25), Seasonal Greenery', NULL, 4
FROM subscription_plans WHERE name = 'Premium Bundle';

-- Seed data for flower_bundles (Plan 3: Luxury Collection - ₹1500/month)
INSERT INTO flower_bundles (plan_id, bundle_name, description, image_url, contents, badge, display_order)
SELECT id, 'Royal Collection', 'Premium roses paired with exotic orchids. The epitome of luxury and grace.', 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&h=400&fit=crop', 'Premium Roses (12), Orchids (8), Premium Foliage', 'Best Seller', 1
FROM subscription_plans WHERE name = 'Luxury Collection'
UNION ALL
SELECT id, 'Supreme Blend', 'The ultimate collection featuring all premium flowers for an unparalleled spiritual experience.', 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=400&h=400&fit=crop', 'Premium Roses (10), Tulips (6), Orchids (6), Lilies (4)', NULL, 2
FROM subscription_plans WHERE name = 'Luxury Collection'
UNION ALL
SELECT id, 'Victory Flowers', 'Symbolizing triumph and success, with golden sunflowers and premium blooms for auspicious moments.', 'https://images.unsplash.com/photo-1597848848224-4d5f0b19ebef?w=400&h=400&fit=crop', 'Sunflowers (8), Premium Roses (12), Lilies (4)', NULL, 3
FROM subscription_plans WHERE name = 'Luxury Collection'
UNION ALL
SELECT id, 'Festival Extravaganza', 'A magnificent premium bundle perfect for special puja occasions and festivals with the finest flowers.', 'https://images.unsplash.com/photo-1611339555312-e607c04352fd?w=400&h=400&fit=crop', 'All Premium Flowers (30), Premium Greenery', NULL, 4
FROM subscription_plans WHERE name = 'Luxury Collection';
