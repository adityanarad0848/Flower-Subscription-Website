# Forgot Password Feature - Setup Guide

## Overview
Complete forgot password functionality with support for both **Email** and **Phone Number** reset methods.

## Features Implemented

### ✅ Email-Based Reset
- Uses Supabase built-in password reset
- Sends secure reset link to user's email
- No additional setup required

### ✅ Phone-Based Reset
- OTP verification via SMS
- 6-digit OTP with 5-minute expiry
- Secure password update after verification

## Quick Setup (5 minutes)

### Step 1: Create OTP Table in Supabase

1. Open [Supabase SQL Editor](https://app.supabase.com)
2. Copy contents of `supabase/migrations/create_otp_table.sql`
3. Paste and click **Run**
4. Verify table `otp_verifications` is created

### Step 2: Test the Feature

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Navigate to http://localhost:5173/auth

3. Click **"Forgot Password?"** link

4. Choose reset method:
   - **Email**: Enter email → Check inbox for reset link
   - **Phone**: Enter phone → Get OTP → Enter new password

## How It Works

### Email Reset Flow
```
User enters email
    ↓
Supabase sends reset link
    ↓
User clicks link in email
    ↓
Redirected to app with token
    ↓
User enters new password
    ↓
Password updated ✓
```

### Phone Reset Flow
```
User enters phone number
    ↓
System checks if phone exists
    ↓
Generate 6-digit OTP
    ↓
Store OTP in database (5 min expiry)
    ↓
Send OTP via SMS (demo: alert)
    ↓
User enters OTP + new password
    ↓
Verify OTP
    ↓
Update password ✓
```

## Production Setup (SMS Integration)

### Option 1: Twilio (Recommended)

1. **Sign up for Twilio**
   - Go to https://www.twilio.com
   - Get Account SID, Auth Token, Phone Number

2. **Add Twilio credentials to Supabase**
   - Go to Supabase Dashboard → Settings → Edge Functions
   - Add secrets:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid
     TWILIO_AUTH_TOKEN=your_auth_token
     TWILIO_PHONE_NUMBER=your_twilio_number
     ```

3. **Deploy Edge Functions**
   ```bash
   supabase functions deploy send-otp
   supabase functions deploy verify-otp
   ```

4. **Update Auth.tsx to use Edge Function**
   Replace the demo OTP code with:
   ```typescript
   const { data, error } = await supabase.functions.invoke('send-otp', {
     body: { phone: resetIdentifier, otp: generatedOtp, type: 'password_reset' }
   })
   ```

### Option 2: AWS SNS

1. **Configure AWS SNS**
   - Create SNS topic
   - Get AWS credentials

2. **Add to Supabase secrets**
   ```
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   AWS_REGION=your_region
   ```

3. **Update Edge Function** to use AWS SNS SDK

### Option 3: Other SMS Providers
- MSG91 (India)
- Vonage (Nexmo)
- Plivo
- Firebase Cloud Messaging

## Database Schema

### otp_verifications Table
```sql
id              UUID PRIMARY KEY
phone           VARCHAR(20) NOT NULL
otp             VARCHAR(6) NOT NULL
type            VARCHAR(50) DEFAULT 'password_reset'
verified        BOOLEAN DEFAULT false
expires_at      TIMESTAMP WITH TIME ZONE NOT NULL
created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
```

## Security Features

✅ OTP expires after 5 minutes
✅ OTP can only be used once
✅ Phone number validation
✅ Password strength requirements (min 6 chars)
✅ Secure password hashing by Supabase
✅ RLS policies on OTP table
✅ Auto-cleanup of expired OTPs

## UI Features

✅ Toggle between Email/Phone reset
✅ Real-time validation
✅ Loading states
✅ Error handling
✅ Success messages
✅ Back to login button
✅ Mobile responsive

## Testing

### Test Email Reset
1. Go to /auth
2. Click "Forgot Password?"
3. Select "Email"
4. Enter: test@example.com
5. Check email for reset link

### Test Phone Reset (Demo Mode)
1. Go to /auth
2. Click "Forgot Password?"
3. Select "Phone Number"
4. Enter: +91 9876543210
5. Click "Send" → See OTP in alert
6. Enter OTP + new password
7. Click "Reset Password"

## Troubleshooting

### Email reset not working?
- Check Supabase email settings
- Verify email templates are enabled
- Check spam folder

### Phone reset not working?
- Verify `otp_verifications` table exists
- Check `user_profiles` table has phone numbers
- Ensure phone format matches database

### OTP expired error?
- OTPs expire after 5 minutes
- Request new OTP

### Password update failed?
- Password must be at least 6 characters
- Passwords must match
- OTP must be valid

## API Endpoints (Edge Functions)

### Send OTP
```
POST /functions/v1/send-otp
Body: { phone: string, otp: string, type: string }
Response: { success: boolean, message: string, expiresAt: string }
```

### Verify OTP
```
POST /functions/v1/verify-otp
Body: { phone: string, otp: string }
Response: { success: boolean, message: string, userId: string }
```

## Environment Variables

Add to `.env`:
```env
# Twilio (for SMS)
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# Or AWS SNS
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
```

## Cost Estimates

### Twilio Pricing (India)
- SMS: ₹0.50 - ₹1.00 per message
- 1000 OTPs ≈ ₹500 - ₹1000

### AWS SNS Pricing
- SMS: $0.00645 per message (India)
- 1000 OTPs ≈ $6.45 (₹540)

## Next Steps

1. ✅ Run `create_otp_table.sql` in Supabase
2. ✅ Test forgot password feature
3. 🔧 Choose SMS provider (Twilio/AWS/MSG91)
4. 🔧 Add SMS credentials to Supabase
5. 🔧 Deploy Edge Functions
6. 🔧 Update Auth.tsx to use Edge Functions
7. 🚀 Test in production

## Support

For issues:
1. Check Supabase logs
2. Verify table schema
3. Test with demo mode first
4. Check SMS provider logs

---

**Quick Test:**
```bash
npm run dev
# Visit http://localhost:5173/auth
# Click "Forgot Password?"
# Test both email and phone methods
```
