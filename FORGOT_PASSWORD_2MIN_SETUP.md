# ⚡ Forgot Password - 2 Minute Setup

## What You Get
✅ "Forgot Password?" link on login page
✅ Email reset (works immediately)
✅ Phone reset with OTP (demo mode)

## Setup (2 Steps)

### Step 1: Create Database Table (1 minute)
```bash
# 1. Open Supabase SQL Editor
# 2. Copy/paste this file: supabase/migrations/create_otp_table.sql
# 3. Click Run ✓
```

### Step 2: Test It (1 minute)
```bash
npm run dev
# Go to http://localhost:5173/auth
# Click "Forgot Password?"
# Try it! 🎉
```

## How It Works

### Email Reset (Production Ready)
1. User clicks "Forgot Password?"
2. Selects "Email"
3. Enters email
4. Gets reset link in inbox
5. Clicks link → Resets password ✓

### Phone Reset (Demo Mode)
1. User clicks "Forgot Password?"
2. Selects "Phone Number"
3. Enters phone
4. Gets OTP (shown in alert)
5. Enters OTP + new password
6. Password reset ✓

## Files

| File | What It Does |
|------|--------------|
| `Auth.tsx` | Updated with forgot password UI |
| `create_otp_table.sql` | Database table for OTPs |
| `send-otp/index.ts` | Edge Function to send OTP |
| `verify-otp/index.ts` | Edge Function to verify OTP |

## For Production

To send real SMS (not alerts):
1. Sign up for Twilio/AWS SNS/MSG91
2. Add credentials to Supabase
3. Deploy Edge Functions
4. Done!

See `FORGOT_PASSWORD_SETUP.md` for details.

## That's It!

Your forgot password feature is ready to use. Email reset works now, phone reset works in demo mode.

**Test it:**
```bash
npm run dev
# Visit /auth → Click "Forgot Password?" → Try both methods
```
