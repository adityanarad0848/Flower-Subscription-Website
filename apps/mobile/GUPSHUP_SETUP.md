# Gupshup WhatsApp OTP Setup Guide

## Overview
Gupshup is one of the most reliable WhatsApp Business API providers. This guide will help you integrate Gupshup WhatsApp OTP into your Mornify mobile app.

---

## Why Gupshup?

✅ **No GST Required** - Start without GST registration  
✅ **Pay-per-use** - ₹0.25 per message (cheaper than Interakt)  
✅ **24-48 Hour Approval** - Fast setup  
✅ **Trusted by Giants** - Used by Flipkart, Zomato, Swiggy  
✅ **20+ Years Experience** - Most reliable platform  
✅ **45,000+ Customers** - Proven at scale  

---

## Step 1: Create Gupshup Account

1. Visit: https://www.gupshup.io/developer/home
2. Click **"Sign Up"** (top right)
3. Fill in details:
   - Full Name
   - Email Address
   - Phone Number
   - Company Name
   - Password
4. Verify email (check inbox)
5. Complete phone verification

---

## Step 2: WhatsApp Business API Setup

### A. Apply for WhatsApp Business API

1. Login to Gupshup dashboard
2. Go to **"WhatsApp"** → **"Get Started"**
3. Click **"Apply for WhatsApp Business API"**
4. Fill application form:
   - **Business Name**: Mornify
   - **Business Category**: E-commerce / Retail
   - **Business Description**: Flower subscription and delivery service
   - **Website**: mornify.in
   - **Business Address**: Your registered address
   - **Business Phone**: Your business number

### B. Documents Required

Upload these documents:
- **Business Registration Certificate** (or)
- **GST Certificate** (optional, but speeds up approval) (or)
- **Shop & Establishment License** (or)
- **Udyam Registration** (MSME certificate)

**Note**: If you don't have any, you can still apply - approval may take 3-5 days instead of 24-48 hours.

---

## Step 3: Get API Credentials

Once approved (you'll get email notification):

1. Go to **Dashboard** → **API Settings**
2. Copy your **API Key**
   - Format: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Note your **App Name**
   - This is your WhatsApp Business Account name
   - Usually: `Mornify` or similar

---

## Step 4: Create WhatsApp Template

### A. Navigate to Templates

1. Go to **WhatsApp** → **Templates**
2. Click **"Create Template"**

### B. Template Details

Fill in the form:

**Template Name**: `otp_template`

**Category**: `AUTHENTICATION`

**Language**: `English`

**Header**: None (leave empty)

**Body**:
```
Your Mornify OTP is {{1}}. Valid for {{2}} minutes. Do not share this code with anyone.

- Mornify Team
```

**Footer**: `Mornify - Fresh Flowers Daily`

**Buttons**: None

**Variables**:
- `{{1}}` = OTP code (6 digits)
- `{{2}}` = Validity time (10 minutes)

### C. Submit for Approval

1. Click **"Submit"**
2. Wait for Meta approval (usually 5-30 minutes)
3. You'll get email when approved

---

## Step 5: Configure Backend

### A. Install Dependencies

```bash
cd apps/mobile/android/backend
npm install
```

### B. Update `.env` File

Create/update `.env` file:

```env
# Gupshup WhatsApp API
GUPSHUP_API_KEY=your_api_key_here
GUPSHUP_APP_NAME=Mornify

# Server Configuration
PORT=3000
```

### C. Start Backend Server

```bash
npm start
```

Server will run on: http://localhost:3000

---

## Step 6: Test OTP Flow

### A. Test API Endpoint

```bash
# Send OTP
curl -X POST http://localhost:3000/api/otp/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:3000/api/otp/verify \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'
```

### B. Test in Mobile App

1. Build and install app:
```bash
cd apps/mobile
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
adb uninstall com.evrydayy.app
adb install app/build/outputs/apk/debug/app-debug.apk
```

2. Open app and test:
   - Enter phone number
   - Click "Continue"
   - Check WhatsApp for OTP
   - Enter OTP and verify

---

## Credentials Required from You

### 1. **Gupshup API Key**
- **Where**: Gupshup Dashboard → API Settings
- **Format**: 32-character alphanumeric string
- **Add to**: `apps/mobile/android/backend/.env`

### 2. **Gupshup App Name**
- **Where**: Gupshup Dashboard → WhatsApp → Settings
- **Example**: `Mornify` or `Mornify Flowers`
- **Add to**: `apps/mobile/android/backend/.env`

### 3. **Business Documents** (for faster approval)
- Business registration certificate
- OR GST certificate
- OR Shop license
- OR Udyam registration

---

## Pricing

### Gupshup Pricing (India)

| Message Type | Cost per Message |
|--------------|------------------|
| Authentication (OTP) | ₹0.25 |
| Marketing | ₹0.35 |
| Utility | ₹0.25 |
| Service | ₹0.20 |

**Example Cost Calculation**:
- 1,000 OTPs/month = ₹250
- 5,000 OTPs/month = ₹1,250
- 10,000 OTPs/month = ₹2,500

**Much cheaper than Interakt's ₹999/month fixed cost!**

---

## Production Deployment

### Backend Hosting Options

**Option 1: AWS EC2 (Recommended)**
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
heroku config:set GUPSHUP_API_KEY=your_key
heroku config:set GUPSHUP_APP_NAME=Mornify
```

**Option 3: DigitalOcean**
- Create Droplet (Ubuntu)
- Install Node.js
- Deploy backend
- Use PM2 for process management

### Update Mobile App

Update backend URL in `PhoneAuth.tsx`:
```typescript
// Change from localhost to production
const BACKEND_URL = 'https://your-backend-domain.com';
```

---

## API Endpoints

### Send OTP
```
POST http://localhost:3000/api/otp/send
Content-Type: application/json

{
  "phone": "+919876543210"
}

Response:
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### Verify OTP
```
POST http://localhost:3000/api/otp/verify
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}

Response:
{
  "success": true,
  "message": "OTP verified successfully"
}
```

---

## Troubleshooting

### OTP not received
- Check Gupshup dashboard for message status
- Verify template is approved by Meta
- Ensure phone number format is correct (+91XXXXXXXXXX)
- Check API key is correct in `.env`

### Template not approved
- Ensure no promotional content in OTP template
- Use only authentication category
- Follow Meta's template guidelines
- Contact Gupshup support if delayed

### Backend connection error
- Ensure backend server is running
- Check firewall/network settings
- Verify backend URL in PhoneAuth.tsx
- Check CORS settings

### API Key invalid
- Regenerate API key from Gupshup dashboard
- Update `.env` file
- Restart backend server

---

## Support

- **Gupshup Support**: support@gupshup.io
- **Documentation**: https://docs.gupshup.io/
- **Phone**: +91-22-33455555
- **Dashboard**: https://www.gupshup.io/developer/home

---

## Comparison: Gupshup vs Interakt

| Feature | Gupshup | Interakt |
|---------|---------|----------|
| **Pricing** | ₹0.25/msg | ₹999/month |
| **GST Required** | No | Yes (for instant) |
| **Approval Time** | 24-48 hours | Instant (with GST) |
| **Best For** | Startups, Scale | Quick launch |
| **Reliability** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Used By** | Flipkart, Zomato | Smaller businesses |

---

## Next Steps

1. ✅ Sign up on Gupshup
2. ✅ Apply for WhatsApp Business API
3. ✅ Upload business documents
4. ✅ Wait for approval (24-48 hours)
5. ✅ Get API key and App name
6. ✅ Create OTP template
7. ✅ Update backend `.env` file
8. ✅ Test OTP flow
9. ✅ Deploy to production

---

## Quick Start Commands

```bash
# 1. Install dependencies
cd apps/mobile/android/backend
npm install

# 2. Update .env file with your credentials
# GUPSHUP_API_KEY=your_key
# GUPSHUP_APP_NAME=Mornify

# 3. Start backend
npm start

# 4. Build and test app
cd ../..
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
adb uninstall com.evrydayy.app
adb install app/build/outputs/apk/debug/app-debug.apk
```

---

**Ready to go! 🚀**

Once you have the Gupshup API key and App name, just update the `.env` file and you're all set!
