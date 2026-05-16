# Twilio WhatsApp OTP Setup Guide

## Overview
Twilio is the fastest way to get WhatsApp OTP working. No business verification needed, start in 15 minutes!

---

## ✅ Why Twilio?

- ⚡ **Instant Setup** - No waiting for approval
- 🎁 **$15 Free Credit** - Test for free
- 🚀 **No Business Verification** - Start immediately
- 🌍 **Global Leader** - Most reliable platform
- 📱 **Sandbox Mode** - Test without approval

---

## Step 1: Create Twilio Account

1. Visit: https://www.twilio.com/try-twilio
2. Click **"Sign up"**
3. Fill in details:
   - First Name
   - Last Name
   - Email
   - Password
4. Verify email
5. Verify phone number (you'll get SMS code)

---

## Step 2: Get Free Credits

After signup:
- You'll get **$15 free credit** automatically
- No credit card required for testing
- Enough for ~40 WhatsApp messages

---

## Step 3: Enable WhatsApp Sandbox

### A. Navigate to WhatsApp

1. Login to Twilio Console: https://console.twilio.com/
2. In left sidebar, click **"Messaging"**
3. Click **"Try it out"**
4. Click **"Send a WhatsApp message"**

### B. Join Sandbox

You'll see instructions like:

**To use WhatsApp Sandbox:**
1. Send WhatsApp message to: **+1 415 523 8886**
2. Message content: **join <your-code>** (e.g., `join happy-tiger`)
3. You'll get confirmation message

**Do this from your phone to test!**

---

## Step 4: Get API Credentials

### A. Account SID

1. Go to Twilio Console: https://console.twilio.com/
2. On dashboard, you'll see **"Account Info"**
3. Copy **"Account SID"**
   - Format: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### B. Auth Token

1. In same **"Account Info"** section
2. Click **"Show"** next to **"Auth Token"**
3. Copy the token
   - Format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### C. WhatsApp Number

For Sandbox (testing):
```
whatsapp:+14155238886
```

For Production (after approval):
- You'll get your own WhatsApp number
- Format: `whatsapp:+1234567890`

---

## Step 5: Configure Backend

### A. Navigate to Backend

```bash
cd /Users/adityanarad/Downloads/Everyday/apps/mobile/android/backend
```

### B. Update `.env` File

Create/update `.env`:

```env
# Twilio WhatsApp API
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# Server Configuration
PORT=3000
```

### C. Install Dependencies

```bash
npm install
```

### D. Start Backend

```bash
npm start
```

Output:
```
Backend server running on port 3000
```

---

## Step 6: Test OTP Flow

### A. Join Sandbox First

**IMPORTANT**: Before testing, you must join the sandbox:

1. Open WhatsApp on your phone
2. Send message to: **+1 415 523 8886**
3. Message: **join <your-code>** (check Twilio console for your code)
4. Wait for confirmation

### B. Test API

```bash
# Send OTP to your number (must be sandbox-joined)
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'
```

### C. Check WhatsApp

- Open WhatsApp
- You should receive OTP message from Twilio
- Message will say: "Your Mornify OTP is 123456..."

### D. Verify OTP

```bash
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```

---

## Step 7: Test in Mobile App

### A. Build App

```bash
cd /Users/adityanarad/Downloads/Everyday/apps/mobile
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

### B. Install App

```bash
adb uninstall com.evrydayy.app
adb install app/build/outputs/apk/debug/app-debug.apk
```

### C. Test Login

1. Open Mornify app
2. Enter your phone number (must be sandbox-joined)
3. Click "Continue"
4. Check WhatsApp for OTP
5. Enter OTP and verify

---

## Credentials Checklist

### ✅ What You Need:

1. **Twilio Account SID**
   - Location: Twilio Console → Dashboard → Account Info
   - Format: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Add to: `.env` as `TWILIO_ACCOUNT_SID`

2. **Twilio Auth Token**
   - Location: Twilio Console → Dashboard → Account Info
   - Click "Show" to reveal
   - Add to: `.env` as `TWILIO_AUTH_TOKEN`

3. **WhatsApp Number**
   - Sandbox: `whatsapp:+14155238886`
   - Add to: `.env` as `TWILIO_WHATSAPP_NUMBER`

---

## Pricing

### Twilio WhatsApp Pricing (India)

| Message Type | Cost per Message |
|--------------|------------------|
| WhatsApp (Sandbox) | **FREE** (testing) |
| WhatsApp (Production) | ₹0.35 per message |
| SMS Fallback | ₹0.60 per SMS |

**Free Credits**: $15 = ~₹1,200 = ~3,400 messages

---

## Sandbox vs Production

### **Sandbox Mode** (Current - Testing)

✅ **Pros**:
- Instant setup
- No approval needed
- Free testing
- Perfect for development

❌ **Cons**:
- Users must join sandbox first
- Shows "Twilio Sandbox" in WhatsApp
- Limited to joined numbers only

### **Production Mode** (After Launch)

✅ **Pros**:
- Send to any number
- Your own WhatsApp number
- Professional appearance
- No "join" requirement

❌ **Cons**:
- Requires business verification
- Takes 1-3 days approval
- Costs ₹0.35 per message

---

## Moving to Production

When ready to launch:

### Step 1: Request WhatsApp Number

1. Go to Twilio Console
2. Click **"Messaging"** → **"WhatsApp"**
3. Click **"Request to enable your Twilio numbers for WhatsApp"**
4. Fill application form

### Step 2: Submit Documents

Upload:
- Business registration certificate
- GST certificate (optional)
- Business address proof

### Step 3: Wait for Approval

- Time: 1-3 business days
- You'll get email notification
- Your own WhatsApp number will be assigned

### Step 4: Update Backend

```env
# Change from sandbox to your number
TWILIO_WHATSAPP_NUMBER=whatsapp:+919876543210
```

---

## Troubleshooting

### OTP not received

**Check 1**: Did you join the sandbox?
```
Send "join <code>" to +1 415 523 8886
```

**Check 2**: Is backend running?
```bash
curl http://localhost:3000/api/otp/send
```

**Check 3**: Check Twilio logs
- Go to Twilio Console → Monitor → Logs
- See message delivery status

### "Unable to create record" error

- Your phone number hasn't joined sandbox
- Join sandbox first before testing

### "Authentication failed" error

- Check Account SID is correct
- Check Auth Token is correct
- Verify no extra spaces in `.env`

### Backend connection error

- Ensure backend is running on port 3000
- Check firewall settings
- Verify backend URL in PhoneAuth.tsx

---

## Support

- **Twilio Support**: https://support.twilio.com/
- **Documentation**: https://www.twilio.com/docs/whatsapp
- **Console**: https://console.twilio.com/
- **Status**: https://status.twilio.com/

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd /Users/adityanarad/Downloads/Everyday/apps/mobile/android/backend
npm install

# 2. Update .env file
# TWILIO_ACCOUNT_SID=ACxxxxx
# TWILIO_AUTH_TOKEN=xxxxx
# TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886

# 3. Start backend
npm start

# 4. Join sandbox from your phone
# Send "join <code>" to +1 415 523 8886

# 5. Test OTP
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# 6. Build and test app
cd ../..
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
adb uninstall com.evrydayy.app
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

## Next Steps

1. ✅ Sign up on Twilio
2. ✅ Get $15 free credit
3. ✅ Enable WhatsApp sandbox
4. ✅ Join sandbox from your phone
5. ✅ Get Account SID and Auth Token
6. ✅ Update backend `.env` file
7. ✅ Test OTP flow
8. ✅ Build and test mobile app
9. ✅ Launch with sandbox
10. ✅ Apply for production when ready

---

**Ready to start! 🚀**

Sign up at: https://www.twilio.com/try-twilio
