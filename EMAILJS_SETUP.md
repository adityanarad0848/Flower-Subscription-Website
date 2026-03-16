# EmailJS Setup Instructions

Your EmailJS template needs the "To Email" field configured. Since I cannot access your EmailJS dashboard, please follow these steps:

## Quick Fix (2 minutes):

1. Go to: https://dashboard.emailjs.com/admin/templates/template_k4r2j1s
2. Login with your EmailJS account
3. Find the field labeled **"To Email"** or **"Send To"**
4. Enter: `{{customer_email}}`
5. Click **Save Template**

## What this does:
- Allows the email to be sent to the customer's email address dynamically
- The `{{customer_email}}` variable will be replaced with the actual email from your checkout form

## Alternative (if you only want admin emails):
- Instead of `{{customer_email}}`, enter: `naradaditya@gmail.com`
- This will send all order emails only to you

## Test after setup:
1. Open `test-email.html` in your browser
2. Click "Send Test Email"
3. Check if you receive the email
4. If successful, your checkout emails will work too

---

## Alternative Solution (No EmailJS Dashboard Access Needed):

If you cannot access EmailJS dashboard, I've created a Supabase Edge Function alternative in:
`/supabase/functions/send-order-email/index.ts`

To use this instead:
1. Sign up for Resend.com (free tier: 100 emails/day)
2. Get your API key
3. Deploy the Supabase function
4. Update Checkout.tsx to use the function instead of EmailJS

Let me know if you want me to implement the Supabase function approach instead.
