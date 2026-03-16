# Email Setup Guide

## Step 1: Create Database Table

Run this SQL in Supabase SQL Editor:

```sql
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
```

## Step 2: Deploy Supabase Function

```bash
cd "/Users/adityanarad/Downloads/Flower Subscription Website"
npx supabase functions deploy send-order-email
```

## Step 3: Test

Place an order and check the `order_emails` table in Supabase. You'll see the email HTML stored there.

## Step 4: Send Emails (Choose One)

### Option A: Manual (Check database and send manually)
- Go to Supabase → Table Editor → order_emails
- Copy the HTML and send via your email client

### Option B: Use Gmail SMTP (Add to edge function)
- Enable Gmail App Password
- Update the edge function to use nodemailer

### Option C: Use Resend.com (Recommended)
1. Sign up at resend.com (free 100 emails/day)
2. Get API key
3. Add to Supabase secrets: `npx supabase secrets set RESEND_API_KEY=your_key`
4. Uncomment Resend code in the function

For now, emails are stored in the database and you can send them manually or set up one of the options above.
