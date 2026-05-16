# Meta WhatsApp Cloud API Setup Guide

## Overview
You're using Meta's WhatsApp Manager directly - this is the official and most reliable way to send WhatsApp messages!

---

## ✅ Current Status

Based on your screenshot:
- ✅ WhatsApp Manager account created
- ✅ Phone number connected
- ⏳ Current limit: 250 messages/24 hours
- 🎯 Next: Verify business to get 2,000 messages/24 hours

---

## Step 1: Verify Your Business (Increase Limit)

### Click "Get started" under "Verify your business"

**Documents Required** (submit any ONE):
1. **Business Registration Certificate**
2. **GST Certificate** 
3. **Shop & Establishment License**
4. **Udyam Registration** (MSME)
5. **Company Incorporation Certificate**
6. **Partnership Deed**

**What happens**:
- Upload document
- Meta reviews (takes up to 24 hours)
- Limit increases: 250 → 2,000 messages/day
- Better deliverability

---

## Step 2: Create OTP Message Template

### A. Navigate to Templates

1. Click **"Message templates"** in left sidebar
2. Click **"Manage templates"**
3. Click **"Create template"** button

### B. Fill Template Details

**Template Name**: `otp_verification`

**Category**: Select **"AUTHENTICATION"**

**Languages**: Select **"English"**

**Header**: Leave empty (None)

**Body**:
```
Your Mornify OTP is {{1}}. Valid for {{2}} minutes. Do not share this code with anyone.

- Mornify Team
```

**Footer**: `Mornify - Fresh Flowers Daily`

**Buttons**: Add button
- Type: **"Copy code"**
- Button text: `Copy code`
- Example code: `123456`

**Sample Content** (for variables):
- Variable 1: `123456`
- Variable 2: `10`

### C. Submit Template

1. Click **"Submit"**
2. Wait for Meta approval (5-30 minutes)
3. You'll see status change to "Approved"

---

## Step 3: Get API Credentials

### A. Get Access Token

1. In WhatsApp Manager, click **"Overview"** (left sidebar)
2. Scroll down to **"API Setup"** section
3. Find **"Temporary access token"**
4. Click **"Copy"** button
5. Save this token (valid for 24 hours for testing)

**For Production** (permanent token):
1. Go to **"System Users"** in Business Settings
2. Create a system user
3. Generate permanent token with `whatsapp_business_messaging` permission

### B. Get Phone Number ID

1. Still in **"Overview"** section
2. Find **"Phone number ID"** 
3. Copy the number (looks like: `123456789012345`)

### C. Get WhatsApp Business Account ID

1. In **"Overview"** section
2. Find **"WhatsApp Business Account ID"**
3. Copy this ID

---

## Step 4: Update Backend Configuration

### A. Navigate to Backend Folder

```bash
cd /Users/adityanarad/Downloads/Everyday/apps/mobile/android/backend
```

### B. Update `.env` File

Create or update the `.env` file:

```env
# Meta WhatsApp Cloud API
META_ACCESS_TOKEN=your_access_token_here
META_PHONE_NUMBER_ID=your_phone_number_id_here

# Server Configuration
PORT=3000
```

**Example**:
```env
META_ACCESS_TOKEN=EAABsbCS1iHgBO7ZC8RZCqL9kVZBmZAw...
META_PHONE_NUMBER_ID=123456789012345
PORT=3000
```

### C. Install Dependencies

```bash
npm install
```

### D. Start Backend Server

```bash
npm start
```

You should see:
```
Backend server running on port 3000
```

---

## Step 5: Test OTP Flow

### A. Test API with cURL

```bash
# Send OTP
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Expected Response:
# {"success":true,"message":"OTP sent successfully"}
```

### B. Check WhatsApp

- Open WhatsApp on the phone number you tested
- You should receive OTP message
- Message will have "Copy code" button

### C. Verify OTP

```bash
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Expected Response:
# {"success":true,"message":"OTP verified successfully"}
```

---

## Step 6: Test in Mobile App

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

### C. Test Login Flow

1. Open Mornify app
2. Enter phone number
3. Click "Continue"
4. Check WhatsApp for OTP
5. Enter OTP in app
6. Should login successfully

---

## Credentials Checklist

### ✅ What You Need:

1. **Meta Access Token**
   - Location: WhatsApp Manager → Overview → API Setup
   - Format: Long alphanumeric string starting with `EAA...`
   - Add to: `.env` as `META_ACCESS_TOKEN`

2. **Phone Number ID**
   - Location: WhatsApp Manager → Overview
   - Format: 15-digit number
   - Add to: `.env` as `META_PHONE_NUMBER_ID`

3. **Approved Template**
   - Name: `otp_verification`
   - Status: Must show "Approved" in template list

---

## Pricing

### Meta WhatsApp Cloud API Pricing (India)

| Conversation Type | First 1,000/month | After 1,000 |
|-------------------|-------------------|-------------|
| Authentication (OTP) | **FREE** | ₹0.25 each |
| Marketing | **FREE** | ₹0.35 each |
| Utility | **FREE** | ₹0.20 each |
| Service | **FREE** | ₹0.15 each |

**Example Cost**:
- 0-1,000 OTPs/month = **FREE** ✨
- 5,000 OTPs/month = ₹1,000 (4,000 × ₹0.25)
- 10,000 OTPs/month = ₹2,250 (9,000 × ₹0.25)

**First 1,000 conversations per month are FREE!** 🎉

---

## Messaging Limits

| Tier | Limit | How to Reach |
|------|-------|--------------|
| **Current** | 250/day | Default for new accounts |
| **Tier 1** | 2,000/day | Verify business documents |
| **Tier 2** | 10,000/day | Send 1,000 messages in 7 days |
| **Tier 3** | 100,000/day | Send 10,000 messages in 7 days |
| **Unlimited** | No limit | Send 100,000 messages in 7 days |

---

## Production Deployment

### Get Permanent Access Token

**Temporary tokens expire in 24 hours!**

For production:

1. Go to **Meta Business Settings**: https://business.facebook.com/settings
2. Click **"System Users"** (left sidebar)
3. Click **"Add"** to create system user
4. Name: `Mornify Backend`
5. Role: **Admin**
6. Click **"Add Assets"**
7. Select your WhatsApp Business Account
8. Enable **"Manage WhatsApp Business Account"**
9. Click **"Generate New Token"**
10. Select permissions:
    - `whatsapp_business_messaging`
    - `whatsapp_business_management`
11. Copy the permanent token
12. Update `.env` with permanent token

### Deploy Backend

**Option 1: AWS EC2**
```bash
# On EC2 instance
git clone your-repo
cd apps/mobile/android/backend
npm install
npm install -g pm2
pm2 start server.js --name mornify-backend
pm2 startup
pm2 save
```

**Option 2: Heroku**
```bash
cd apps/mobile/android/backend
heroku create mornify-backend
git push heroku main
heroku config:set META_ACCESS_TOKEN=your_token
heroku config:set META_PHONE_NUMBER_ID=your_id
```

### Update Mobile App

In `PhoneAuth.tsx`, change:
```typescript
const BACKEND_URL = 'https://your-backend-domain.com';
```

---

## Troubleshooting

### OTP not received
- ✅ Check template is approved
- ✅ Verify phone number format (+91XXXXXXXXXX)
- ✅ Check messaging limits (250/day initially)
- ✅ Verify access token is valid
- ✅ Check backend logs for errors

### Template not approved
- Use only authentication category
- No promotional content
- Follow Meta's guidelines
- Usually takes 5-30 minutes

### Access token expired
- Temporary tokens expire in 24 hours
- Generate permanent token for production
- Update `.env` file

### Rate limit exceeded
- Current limit: 250 messages/24 hours
- Verify business to increase to 2,000
- Check "Messaging limits" in dashboard

---

## Support

- **Meta Support**: https://business.facebook.com/business/help
- **Documentation**: https://developers.facebook.com/docs/whatsapp/cloud-api
- **Status**: https://developers.facebook.com/status/

---

## Quick Summary

### Immediate Actions:

1. ✅ **Verify Business** - Click "Get started" in your dashboard
2. ✅ **Create Template** - Name: `otp_verification`, Category: Authentication
3. ✅ **Get Credentials** - Copy Access Token and Phone Number ID
4. ✅ **Update `.env`** - Add credentials to backend
5. ✅ **Test** - Send test OTP to your number

### Your Current Setup:

```env
# Add these to: apps/mobile/android/backend/.env

META_ACCESS_TOKEN=EAABsbCS1iHgBO7ZC8RZCqL9kVZBmZAw...
META_PHONE_NUMBER_ID=123456789012345
PORT=3000
```

---

**Ready to go! 🚀**

Once you complete these steps, your WhatsApp OTP will be working perfectly!
