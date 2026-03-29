# PayUmoney Integration Setup Guide

## 🚀 Complete Setup Instructions

### 1. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Credentials
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and add your PayUmoney credentials:
   ```
   MERCHANT_KEY=your_actual_merchant_key
   MERCHANT_SALT=your_actual_merchant_salt
   MERCHANT_ID=your_actual_merchant_id
   PORT=3000
   PAYUMONEY_ENV=sandbox
   ```

#### Start Backend Server
```bash
npm start
# Or for development with auto-reload:
npm run dev
```

Server will run on `http://localhost:3000`

---

### 2. Android Setup

#### Sync Capacitor
```bash
npx cap sync android
```

#### Build Android App
```bash
npx cap open android
# Then build from Android Studio
```

---

### 3. Frontend Integration

#### Copy Files to Your Project
1. Copy `payumoney-plugin.ts` to your src folder
2. Copy `payumoney-example.ts` (now PaymentService) to your services folder

#### Use in Your Component
```typescript
import { PaymentService } from './services/payumoney-example';

const paymentService = new PaymentService();

async function handlePayment() {
  try {
    const result = await paymentService.initiatePayment({
      amount: '100.00',
      productInfo: 'Flower Subscription - Monthly',
      firstName: 'John Doe',
      email: 'john@example.com',
      phone: '9876543210'
    });

    if (result.success) {
      alert('Payment successful! Transaction ID: ' + result.transactionId);
    } else {
      alert('Payment failed: ' + result.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Payment error occurred');
  }
}
```

---

### 4. Get PayUmoney Credentials

1. Login to PayUmoney Dashboard: https://www.payumoney.com/merchant-dashboard/
2. Go to Settings → API Keys
3. Copy:
   - Merchant Key
   - Merchant Salt
   - Merchant ID

**For Testing:**
- Use Sandbox/Test mode credentials
- Set `isProduction: false` in payment config

**For Production:**
- Use Production credentials
- Set `isProduction: true` in payment config

---

### 5. Testing

#### Test Cards (Sandbox Mode)
- Card Number: 5123456789012346
- CVV: 123
- Expiry: Any future date
- Name: Any name

#### Test Flow
1. Start backend server
2. Run your app on Android device/emulator
3. Trigger payment
4. Complete payment with test card
5. Check backend logs for success/failure

---

### 6. API Endpoints

**Generate Hash:**
```
POST http://localhost:3000/api/payment/generate-hash
Body: {
  "txnId": "TXN123456",
  "amount": "100.00",
  "productInfo": "Product Name",
  "firstName": "John",
  "email": "john@example.com",
  "phone": "9876543210"
}
```

**Success Callback:**
```
POST http://localhost:3000/api/payment/success
```

**Failure Callback:**
```
POST http://localhost:3000/api/payment/failure
```

---

### 7. Production Deployment

1. Deploy backend to a server (AWS, Heroku, etc.)
2. Update `BACKEND_URL` in `payumoney-example.ts`
3. Use production PayUmoney credentials
4. Set `isProduction: true`
5. Test thoroughly before going live

---

### 8. Security Notes

- ✅ Never expose Merchant Salt in frontend
- ✅ Always generate hash on backend
- ✅ Verify payment response hash on backend
- ✅ Use HTTPS in production
- ✅ Store credentials in environment variables
- ✅ Validate all payment callbacks

---

### 9. Troubleshooting

**Payment not starting:**
- Check if backend is running
- Verify credentials in .env
- Check Android logs: `adb logcat`

**Hash mismatch:**
- Verify hash generation format
- Check if all parameters match
- Ensure Merchant Salt is correct

**Network errors:**
- Check backend URL in frontend
- Ensure CORS is enabled
- Verify network permissions in AndroidManifest.xml

---

### 10. Support

- PayUmoney Docs: https://docs.payumoney.com/
- PayUmoney Support: support@payumoney.com
- Test Dashboard: https://test.payumoney.com/

---

## 📁 File Structure

```
android/
├── backend/
│   ├── server.js           # Backend server
│   ├── package.json        # Dependencies
│   └── .env.example        # Config template
├── app/src/main/java/com/flowersubscription/app/
│   ├── PayUMoneyPlugin.java    # Native plugin
│   └── MainActivity.java       # Plugin registration
├── payumoney-plugin.ts     # TypeScript interface
└── payumoney-example.ts    # Payment service
```

---

## ✅ Quick Start Checklist

- [ ] Install backend dependencies
- [ ] Configure .env with credentials
- [ ] Start backend server
- [ ] Sync Capacitor (npx cap sync android)
- [ ] Copy plugin files to your project
- [ ] Update BACKEND_URL in code
- [ ] Test with sandbox credentials
- [ ] Verify payment flow works
- [ ] Deploy backend for production
- [ ] Switch to production credentials
