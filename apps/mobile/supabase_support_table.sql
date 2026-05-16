-- Create support_messages table
CREATE TABLE IF NOT EXISTS support_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'support')),
  user_name TEXT,
  user_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_support_messages_user_id ON support_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_created_at ON support_messages(created_at);

-- Enable RLS
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own messages
CREATE POLICY "Users can read own messages" ON support_messages
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own messages
CREATE POLICY "Users can insert own messages" ON support_messages
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
