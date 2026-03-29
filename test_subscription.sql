-- Add a test subscription with proper price
-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users table
-- Replace 'YOUR_PRODUCT_ID' with actual product ID from products table

INSERT INTO user_subscriptions (
  user_id,
  product_id,
  product_name,
  start_date,
  end_date,
  duration,
  price,
  status,
  created_at
) VALUES (
  'YOUR_USER_ID',  -- Get this from: SELECT id FROM auth.users WHERE email = 'your@email.com';
  'YOUR_PRODUCT_ID',  -- Get this from: SELECT id FROM products LIMIT 1;
  'Marigold Flowers',  -- Product name
  CURRENT_DATE,  -- Start today
  CURRENT_DATE + INTERVAL '30 days',  -- End in 30 days
  'month',  -- Duration
  600,  -- Total price ₹600 for 30 days = ₹20 per day
  'active',  -- Status
  NOW()  -- Created at
);

-- To find your user ID, run:
-- SELECT id, email FROM auth.users;

-- To find product ID, run:
-- SELECT id, name, price FROM products;
