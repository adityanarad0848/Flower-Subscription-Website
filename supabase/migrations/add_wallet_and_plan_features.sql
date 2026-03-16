-- Add wallet table
CREATE TABLE IF NOT EXISTS user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  balance DECIMAL(10, 2) DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add wallet transactions table
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES user_wallets(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  type TEXT CHECK (type IN ('credit', 'debit')) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add plan duration to subscription_plans
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS duration_type TEXT CHECK (duration_type IN ('day', 'week', 'month')) DEFAULT 'month';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS duration_value INT DEFAULT 1;

-- Add end_date and pause tracking to user_subscriptions
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS end_date DATE;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS paused_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE user_subscriptions ADD COLUMN IF NOT EXISTS pause_days_remaining INT DEFAULT 0;

-- Add user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  phone TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_wallets
CREATE POLICY "user_wallets_read_own" ON user_wallets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_wallets_insert_own" ON user_wallets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_wallets_update_own" ON user_wallets FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for wallet_transactions
CREATE POLICY "wallet_transactions_read_own" ON wallet_transactions FOR SELECT USING (
  wallet_id IN (SELECT id FROM user_wallets WHERE user_id = auth.uid())
);

-- RLS policies for user_profiles
CREATE POLICY "user_profiles_read_own" ON user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_user_wallets_user_id ON user_wallets(user_id);
CREATE INDEX idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);
