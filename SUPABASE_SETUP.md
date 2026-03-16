# Supabase Setup Instructions

## To set up the subscription tables and demo data:

### Step 1: Create Tables
1. Go to your Supabase dashboard → Select your project
2. Navigate to SQL Editor
3. Copy the entire contents of `/supabase/migrations/create_subscription_tables.sql`
4. Paste into a new SQL query
5. Click "Run" to execute

### Step 2: Add Demo Data
1. In the SQL Editor, create a new query
2. Copy the entire contents of `/supabase/migrations/seed_subscription_data.sql`
3. Paste into the SQL query
4. Click "Run" to execute

### What Gets Created:
- **subscription_plans**: 3 plans at ₹999, ₹1200, ₹1500/month
- **flower_bundles**: 12 total flower bundle options (3-4 per plan)
- **user_subscriptions**: Stores user subscription data with daily selections
- **delivery_schedules**: Tracks delivery status and flower selections per day
- All tables come with RLS (Row Level Security) policies enabled

### Verification Steps:
1. Go to Table Editor on Supabase
2. Verify you can see:
   - `subscription_plans` with 3 rows
   - `flower_bundles` with 12 rows
   - Other tables created (empty initially, will be populated when users subscribe)

### Database Schema Summary:
```
subscription_plans
├── id (UUID)
├── name (text)
├── price (decimal)
├── description
├── quantity_per_day
├── delivery_frequency
├── pickup_enabled
├── pickup_time_start ("07:00")
└── pickup_time_end ("09:00")

flower_bundles
├── id (UUID)
├── plan_id (FK)
├── bundle_name
├── description
├── image_url (Unsplash URLs)
├── contents
├── badge (Popular/Best Seller)
└── display_order

user_subscriptions
├── id (UUID)
├── user_id (FK → auth.users)
├── plan_id (FK)
├── status (active/paused/cancelled)
├── start_date
├── next_billing_date
└── daily_selections (JSONB: {"2024-02-28": "bundle_id_1", ...})

delivery_schedules
├── id (UUID)
├── subscription_id (FK)
├── delivery_date
├── flower_bundle_id
├── status (pending/delivered/old_flowers_picked)
└── pickup_time_slot ("07:00-09:00")
```

## Frontend Integration:
The TypeScript types have been created in `/src/app/types/subscription.ts` for use in React components.
