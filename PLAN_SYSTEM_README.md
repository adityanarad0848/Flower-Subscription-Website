# Plan-Based Subscription System

## Overview
This implementation adds a complete plan-based subscription system with wallet management, user authentication, and pause/resume functionality.

## Features Implemented

### 1. User Authentication & Profile
- **Auth Component** (`/auth` route)
  - User registration with full name, phone, and address
  - Login functionality
  - Automatic wallet creation on signup

### 2. Wallet Management
- **Minimum**: Rs.500
- **Maximum**: Rs.2000
- View balance in Account section
- Add money functionality
- Transaction history tracking

### 3. Plan Selection (`/plans` route)
- Choose plan duration:
  - **Day**: Daily subscription
  - **Week**: Weekly subscription  
  - **Month**: Monthly subscription
- View all available plans
- Subscribe using wallet balance
- Automatic deduction from wallet

### 4. Account Section (`/account` route)
- **Profile Information**: Name, email, phone, address
- **Wallet Balance**: Current balance with add money option
- **Active Plans Display**:
  - Plan name
  - Status (active/paused)
  - Start date
  - End date
  - Pause/Resume button
- **Calendar**: View subscription schedule

### 5. Pause & Resume Functionality
- Pause active subscriptions
- Resume paused subscriptions
- Status tracking with timestamps

## Database Schema

### New Tables:
1. **user_wallets**: Store user wallet balance
2. **wallet_transactions**: Track all wallet transactions
3. **user_profiles**: Store user details

### Updated Tables:
1. **subscription_plans**: Added `duration_type` and `duration_value`
2. **user_subscriptions**: Added `end_date`, `paused_at`, `pause_days_remaining`

## Setup Instructions

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Database Migrations**:
   ```bash
   # Run the migration files in order:
   # 1. create_subscription_tables.sql
   # 2. add_wallet_and_plan_features.sql
   # 3. seed_plan_durations.sql
   ```

3. **Configure Supabase**:
   - Create a `.env` file with:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

## User Journey

1. **Sign Up** → Navigate to `/auth` and create account
2. **Add Money** → Go to `/account` and add Rs.500-2000 to wallet
3. **Choose Plan** → Visit `/plans` and select duration (day/week/month)
4. **Subscribe** → Click subscribe button (wallet balance will be deducted)
5. **Manage Plan** → View active plans in `/account` with start/end dates
6. **Pause/Resume** → Use buttons in account section to pause or resume plans
7. **View Calendar** → Check subscription schedule in account section

## Navigation
- Home: `/`
- Plans: `/plans`
- Account: `/account`
- Auth: `/auth`
- Subscriptions: `/subscriptions`
- Products: `/products`

## Key Components

- **Auth.tsx**: User registration and login
- **Account.tsx**: Profile, wallet, active plans, calendar
- **PlanSelection.tsx**: Browse and subscribe to plans

## Notes

- Wallet balance must be sufficient before subscribing
- Plans automatically calculate end dates based on duration type
- Paused plans retain their status until resumed
- All transactions are logged in wallet_transactions table
