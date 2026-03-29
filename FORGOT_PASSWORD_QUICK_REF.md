# Forgot Password - Quick Reference

## ✅ What's Been Added

### Frontend (Auth.tsx)
- ✅ "Forgot Password?" link on login page
- ✅ Separate forgot password view
- ✅ Email reset option (uses Supabase built-in)
- ✅ Phone reset option (OTP-based)
- ✅ OTP input and verification
- ✅ New password form
- ✅ Error and success messages
- ✅ Back to login button

### Backend
- ✅ OTP table migration (`create_otp_table.sql`)
- ✅ Send OTP Edge Function (`send-otp/index.ts`)
- ✅ Verify OTP Edge Function (`verify-otp/index.ts`)
- ✅ Auto-cleanup for expired OTPs

## 🚀 Quick Start

### 1. Create OTP Table (Required)
```sql
-- Run in Supabase SQL Editor
-- File: supabase/migrations/create_otp_table.sql
```

### 2. Test It
```bash
npm run dev
# Go to http://localhost:5173/auth
# Click "Forgot Password?"
```

## 📱 How Users Will Use It

### Email Reset
1. Click "Forgot Password?"
2. Select "Email"
3. Enter email address
4. Click "Send"
5. Check email inbox
6. Click reset link
7. Enter new password

### Phone Reset
1. Click "Forgot Password?"
2. Select "Phone Number"
3. Enter phone number
4. Click "Send"
5. Receive OTP (currently shows in alert)
6. Enter OTP
7. Enter new password
8. Click "Reset Password"

## 🔧 Current Status

### ✅ Working Now (Demo Mode)
- Email reset (fully functional)
- Phone reset (OTP shown in alert)
- Password update
- Database storage

### 🔨 For Production
- Integrate SMS provider (Twilio/AWS SNS)
- Deploy Edge Functions
- Add SMS credentials

## 📋 Files Created

| File | Purpose |
|------|---------|
| `Auth.tsx` (updated) | Forgot password UI |
| `create_otp_table.sql` | OTP database table |
| `send-otp/index.ts` | Send OTP Edge Function |
| `verify-otp/index.ts` | Verify OTP Edge Function |
| `FORGOT_PASSWORD_SETUP.md` | Complete setup guide |

## 🎯 Next Steps for Production

1. **Choose SMS Provider**
   - Twilio (recommended)
   - AWS SNS
   - MSG91 (India)

2. **Add Credentials**
   ```bash
   # In Supabase Dashboard → Settings → Edge Functions
   TWILIO_ACCOUNT_SID=xxx
   TWILIO_AUTH_TOKEN=xxx
   TWILIO_PHONE_NUMBER=xxx
   ```

3. **Deploy Functions**
   ```bash
   supabase functions deploy send-otp
   supabase functions deploy verify-otp
   ```

4. **Update Auth.tsx**
   - Replace alert() with actual Edge Function call
   - Use supabase.functions.invoke('send-otp', ...)

## 🔒 Security

- ✅ OTP expires in 5 minutes
- ✅ One-time use only
- ✅ Secure password hashing
- ✅ Phone validation
- ✅ RLS policies

## 💡 Demo Mode

Currently, OTP is shown in browser alert:
```javascript
alert(`OTP: ${generatedOtp}`)
```

In production, this will be sent via SMS.

## 📞 SMS Provider Setup (Quick)

### Twilio (Easiest)
```bash
# 1. Sign up: https://www.twilio.com
# 2. Get credentials
# 3. Add to Supabase secrets
# 4. Uncomment Twilio code in send-otp/index.ts
# 5. Deploy function
```

### Cost: ~₹0.50 per SMS in India

---

**Ready to test?**
```bash
npm run dev
# Visit /auth → Click "Forgot Password?"
```
