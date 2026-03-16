-- Create subscription_plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  quantity_per_day INT,
  delivery_frequency TEXT DEFAULT 'Daily',
  pickup_enabled BOOLEAN DEFAULT true,
  pickup_time_start TIME DEFAULT '07:00',
  pickup_time_end TIME DEFAULT '09:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create flower_bundles table
CREATE TABLE IF NOT EXISTS flower_bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES subscription_plans(id) ON DELETE CASCADE,
  bundle_name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  contents TEXT,
  badge TEXT,
  display_order INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  start_date DATE NOT NULL,
  next_billing_date DATE NOT NULL,
  daily_selections JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create delivery_schedules table
CREATE TABLE IF NOT EXISTS delivery_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  delivery_date DATE NOT NULL,
  flower_bundle_id UUID REFERENCES flower_bundles(id),
  status TEXT CHECK (status IN ('pending', 'delivered', 'old_flowers_picked')) DEFAULT 'pending',
  pickup_time_slot TEXT DEFAULT '07:00-09:00',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_flower_bundles_plan_id ON flower_bundles(plan_id);
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_plan_id ON user_subscriptions(plan_id);
CREATE INDEX idx_delivery_schedules_subscription_id ON delivery_schedules(subscription_id);
CREATE INDEX idx_delivery_schedules_delivery_date ON delivery_schedules(delivery_date);

-- Enable RLS (Row Level Security)
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE flower_bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_schedules ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for subscription_plans (public read)
CREATE POLICY "subscription_plans_read_public" ON subscription_plans
  FOR SELECT USING (true);

-- Create RLS policies for flower_bundles (public read)
CREATE POLICY "flower_bundles_read_public" ON flower_bundles
  FOR SELECT USING (true);

-- Create RLS policies for user_subscriptions (users can only see their own)
CREATE POLICY "user_subscriptions_read_own" ON user_subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_insert_own" ON user_subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_subscriptions_update_own" ON user_subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for delivery_schedules (users can see their own)
CREATE POLICY "delivery_schedules_read_own" ON delivery_schedules
  FOR SELECT USING (
    subscription_id IN (
      SELECT id FROM user_subscriptions WHERE user_id = auth.uid()
    )
  );
