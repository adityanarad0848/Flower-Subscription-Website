# Database Setup Guide

## Quick Start (Recommended)

### Option 1: Manual Setup via Supabase Dashboard (Fastest)

**Step 1: Create Tables**
1. Go to [app.supabase.com](https://app.supabase.com) and log in
2. Select your Flower Subscription project
3. Click on **SQL Editor** (left sidebar)
4. Click **New Query**
5. Open this file: `/supabase/migrations/create_subscription_tables.sql`
6. Copy the entire file contents
7. Paste into the Supabase SQL Editor
8. Click the **Run** button (or press Ctrl+Enter)
9. Wait for success message ✅

**Step 2: Add Demo Data**
1. Click **New Query** again
2. Open this file: `/supabase/migrations/seed_subscription_data.sql`
3. Copy the entire file contents
4. Paste into a new SQL query
5. Click **Run**
6. Wait for success message ✅

**Step 3: Verify**
1. Click **Table Editor** (left sidebar)
2. You should see these tables with data:
   - `subscription_plans` - 3 rows
   - `flower_bundles` - 12 rows
   - `user_subscriptions` - (empty)
   - `delivery_schedules` - (empty)

---

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Install Supabase CLI (if not already installed)
npm install -g supabase

# Navigate to project directory
cd "/Users/adityanarad/Downloads/Flower Subscription Website"

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
supabase db push
```

---

## Verification Checklist

After running the migrations, verify everything is set up correctly:

```sql
-- Check subscription plans
SELECT name, price FROM subscription_plans;
-- Expected: 3 rows (Daily Essentials, Premium Bundle, Luxury Collection)

-- Check flower bundles
SELECT bundle_name, plan_id FROM flower_bundles;
-- Expected: 12 rows total

-- Check RLS policies are enabled
SELECT tablename FROM pg_tables
WHERE tablename IN ('subscription_plans', 'flower_bundles', 'user_subscriptions', 'delivery_schedules');
-- Expected: 4 rows
```

---

## What Gets Created

### Tables Created:
- **subscription_plans** (3 rows)
  - Daily Essentials (₹999/month)
  - Premium Bundle (₹1200/month)
  - Luxury Collection (₹1500/month)

- **flower_bundles** (12 rows total)
  - Plan 1: 3 bundles (Rose Radiance, Marigold Magic, Divine Mix)
  - Plan 2: 4 bundles (Premium Roses, Luxury Blend, Festival Special, Exotic Mix)
  - Plan 3: 4 bundles (Royal Collection, Supreme Blend, Victory Flowers, Festival Extravaganza)

- **user_subscriptions** (empty, fills as users subscribe)
- **delivery_schedules** (empty, fills as orders are created)

### Security:
- Row Level Security (RLS) enabled on all tables
- Public read access to plans and bundles
- Users can only see their own subscription data
- Delivery schedules visible only to subscription owner

---

## Troubleshooting

**Error: "relation "subscription_plans" does not exist"**
- The tables haven't been created yet
- Run the create_subscription_tables.sql migration first

**Error: "duplicate key value violates unique constraint"**
- The tables already exist
- This is fine - you can proceed to the next step
- Or you can delete the tables and re-run the migration

**Error: "permission denied"**
- You may not have admin access to Supabase
- Contact your Supabase workspace owner
- Or use a different Supabase project

---

## Next Steps

Once tables are created:

1. The app will automatically use these tables
2. Run `npm run dev` to start the development server
3. Navigate to `/subscriptions` to see subscription plans
4. The calendar customizer will be ready to use

---

## Environment Setup

Make sure your `.env.local` has:

```
VITE_PUBLIC_SUPABASE_URL=your_url
VITE_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

These should already be configured if you set up Supabase earlier.

---

## Support

If you encounter any issues:
1. Check the Supabase logs: Dashboard → Logs
2. Verify RLS policies are set correctly
3. Try resetting admin rules in Supabase settings
