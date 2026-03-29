-- Create subscription_paused_dates table for managing paused and rescheduled delivery dates
CREATE TABLE IF NOT EXISTS subscription_paused_dates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  subscription_id UUID NOT NULL REFERENCES user_subscriptions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pause_date DATE NOT NULL,
  rescheduled_to DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscription_id, pause_date)
);

-- Create index for faster queries
CREATE INDEX idx_subscription_paused_dates_subscription ON subscription_paused_dates(subscription_id);
CREATE INDEX idx_subscription_paused_dates_user ON subscription_paused_dates(user_id);
CREATE INDEX idx_subscription_paused_dates_date ON subscription_paused_dates(pause_date);

-- Enable RLS
ALTER TABLE subscription_paused_dates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own paused dates"
  ON subscription_paused_dates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own paused dates"
  ON subscription_paused_dates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own paused dates"
  ON subscription_paused_dates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own paused dates"
  ON subscription_paused_dates FOR DELETE
  USING (auth.uid() = user_id);

-- Add trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_paused_dates_updated_at
  BEFORE UPDATE ON subscription_paused_dates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
