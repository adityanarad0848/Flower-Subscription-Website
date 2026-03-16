# Quick Setup Guide

## Step 1: Install Dependencies (DONE ✓)
```bash
npm install
```

## Step 2: Run Database Migrations

Go to your Supabase Dashboard:
1. Open https://dzytzztohlvjwdsfhoua.supabase.co
2. Go to **SQL Editor**
3. Run these migration files **in order**:

### Migration 1: Create Base Tables
Run the content from: `supabase/migrations/create_subscription_tables.sql`

### Migration 2: Add Wallet & Plan Features
Run the content from: `supabase/migrations/add_wallet_and_plan_features.sql`

### Migration 3: Seed Plan Data
Run the content from: `supabase/migrations/seed_plan_durations.sql`

## Step 3: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 4: Test the Application

1. Navigate to http://localhost:5173/auth
2. Create a new account
3. Go to http://localhost:5173/account
4. Add money to wallet (Rs.500-2000)
5. Go to http://localhost:5173/plans
6. Subscribe to a plan
7. Return to http://localhost:5173/account to see active plans

## Troubleshooting

If you see "Please login" on the Account page:
- Make sure you're logged in at /auth first

If you see database errors:
- Verify all migrations ran successfully in Supabase SQL Editor
- Check browser console for specific errors

If changes don't appear:
- Hard refresh browser (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Clear browser cache
- Restart dev server
