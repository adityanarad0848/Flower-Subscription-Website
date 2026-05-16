# Interakt WhatsApp OTP Setup Guide

## Overview
This guide will help you integrate Interakt WhatsApp OTP into your Mornify mobile app.

---

## Step 1: Create Interakt Account

1. Visit: https://app.interakt.ai/signup
2. Sign up with your business email
3. Complete business verification (instant approval)
4. Choose plan: ₹999/month for production access

---

## Step 2: Get API Credentials

1. Login to Interakt dashboard: https://app.interakt.ai/
2. Go to **Settings** → **API Keys**
3. Copy your **API Key** (looks like: `Basic xxxxxxxxxxxxxxxx`)
4. Save this key securely

---

## Step 3: Create WhatsApp OTP Template

1. In Interakt dashboard, go to **Templates** → **Create Template**
2. Template details:
   - **Template Name**: `otp_template`
   - **Category**: Authentication
   - **Language**: English
   - **Header**: None
   - **Body**: 
     ```
     Your Mornify OTP is {{1}}. Valid for {{2}} minutes. Do not share this code with anyone.
     ```
   - **Footer**: Mornify - Fresh Flowers Daily
   - **Buttons**: None

3. Submit for approval (usually instant for OTP templates)
4. Wait for Meta approval (typically 5-10 minutes)

---

## Step 4: Configure Backend

1. Navigate to backend directory:
   ```bash
   cd apps/mobile/android/backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update `.env` file:
   ```env
   # Interakt WhatsApp API
   INTERAKT_API_KEY=Basic_YOUR_API_KEY_HERE
   
   # Server Configuration
   PORT=3000
   ```

4. Start backend server:
   ```bash
   npm start
   ```

   Server will run on: http://localhost:3000

---

## Step 5: Update Mobile App Configuration

1. Open `apps/mobile/src/app/components/PhoneAuth.tsx`
2. Update backend URL if deploying to production:
   ```typescript
   // Change from localhost to your production URL
   const BACKEND_URL = 'https://your-backend-domain.com';
   ```

---

## Step 6: Test OTP Flow

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
   - Enter Indian phone number (+91XXXXXXXXXX)
   - Click "Continue"
   - Check WhatsApp for OTP message
   - Enter OTP and verify

---

## Credentials Required from You

### 1. Interakt API Key
- **Where to get**: https://app.interakt.ai/ → Settings → API Keys
- **Format**: `Basic xxxxxxxxxxxxxxxx`
- **Add to**: `apps/mobile/android/backend/.env`

### 2. WhatsApp Business Number
- **Requirement**: You need a WhatsApp Business account
- **Setup**: Interakt will guide you through connecting your WhatsApp Business number
- **Note**: Can use existing business number or get new one

---

## Production Deployment

### Backend Hosting Options:
1. **AWS EC2** (Recommended)
   - Deploy Node.js server
   - Use PM2 for process management
   - Setup nginx reverse proxy

2. **Heroku**
   - Easy deployment
   - Free tier available
   - Auto-scaling

3. **DigitalOcean**
   - Affordable VPS
   - Simple setup

### Environment Variables for Production:
```env
INTERAKT_API_KEY=Basic_YOUR_PRODUCTION_API_KEY
PORT=3000
NODE_ENV=production
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
```

### Verify OTP
```
POST http://localhost:3000/api/otp/verify
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

---

## Troubleshooting

### OTP not received
- Check Interakt dashboard for message status
- Verify template is approved
- Ensure phone number is in correct format (+91XXXXXXXXXX)
- Check API key is correct

### Backend connection error
- Ensure backend server is running
- Check firewall/network settings
- Verify backend URL in PhoneAuth.tsx

### Template not approved
- Check template follows Meta guidelines
- Ensure no promotional content in OTP template
- Contact Interakt support if delayed

---

## Cost Estimation

- **Interakt Plan**: ₹999/month (unlimited messages)
- **WhatsApp Business**: Free
- **Backend Hosting**: ₹500-2000/month (depending on provider)

**Total**: ~₹1500-3000/month

---

## Support

- **Interakt Support**: support@interakt.ai
- **Documentation**: https://docs.interakt.ai/
- **WhatsApp**: +91-XXXXXXXXXX (Interakt support number)

---

## Next Steps

1. ✅ Sign up for Interakt account
2. ✅ Get API key
3. ✅ Create OTP template
4. ✅ Update backend `.env` file
5. ✅ Start backend server
6. ✅ Test OTP flow
7. ✅ Deploy to production
