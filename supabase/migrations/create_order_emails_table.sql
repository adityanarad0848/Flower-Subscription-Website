CREATE TABLE IF NOT EXISTS order_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  to_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  html_content TEXT NOT NULL,
  order_data JSONB,
  sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE order_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow service role full access" ON order_emails
  FOR ALL USING (true);
