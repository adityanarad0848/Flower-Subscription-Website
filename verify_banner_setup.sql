-- Banner Verification Script
-- Run this to check if banners are set up correctly

-- Check if table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_name = 'banners'
    ) 
    THEN '✅ Banners table exists'
    ELSE '❌ Banners table NOT found - Run create_banners_table.sql first'
  END as table_status;

-- Check active banners
SELECT 
  '📊 Active Banners:' as info,
  COUNT(*) as count
FROM banners 
WHERE is_active = true;

-- List all banners
SELECT 
  title,
  subtitle,
  is_active,
  icon_emoji,
  display_order,
  CASE 
    WHEN start_date IS NULL AND end_date IS NULL THEN 'Always visible'
    WHEN start_date IS NULL THEN 'Until ' || end_date
    WHEN end_date IS NULL THEN 'From ' || start_date
    ELSE start_date || ' to ' || end_date
  END as schedule
FROM banners
ORDER BY display_order;

-- Check RLS policies
SELECT 
  '🔒 RLS Policies:' as info,
  COUNT(*) as policy_count
FROM pg_policies 
WHERE tablename = 'banners';

-- Test query (what the app uses)
SELECT 
  '🎯 Banner that will show on home page:' as info,
  title,
  subtitle,
  icon_emoji
FROM banners
WHERE is_active = true
ORDER BY display_order ASC
LIMIT 1;
