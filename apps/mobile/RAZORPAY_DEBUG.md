# Razorpay Payment Debugging Guide

## 🔍 Comprehensive Logging Added

I've added detailed logging throughout the entire Razorpay payment flow to help diagnose issues.

## 📍 Where Logging Was Added

### 1. **Frontend (TypeScript/React)**
- `src/razorpay-service.ts` - Main payment service
- `src/app/components/Checkout.tsx` - Checkout component

### 2. **Native Android (Java)**
- `android/app/src/main/java/com/evrydayy/app/MainActivity.java` - Main activity
- `android/app/src/main/java/com/evrydayy/app/plugins/RazorpayNativePlugin.java` - Razorpay plugin

## 🚀 How to View Logs

### Option 1: Android Studio Logcat (Recommended)
1. Open Android Studio
2. Open the project: `File > Open > [path]/mobile/android`
3. Connect your device or start emulator
4. Click on "Logcat" tab at the bottom
5. Filter by tags:
   - `RazorpayNativePlugin` - Native plugin logs
   - `MainActivity` - Activity logs
   - Or search for "Razorpay" to see all related logs

### Option 2: Command Line (ADB)
```bash
# View all logs
adb logcat

# Filter for Razorpay-related logs
adb logcat | grep -E "Razorpay|MainActivity"

# Filter for specific tags
adb logcat RazorpayNativePlugin:D MainActivity:D *:S

# Clear logs and start fresh
adb logcat -c && adb logcat | grep -E "Razorpay|MainActivity"
```

### Option 3: Chrome DevTools (Web Console)
1. Connect your Android device via USB
2. Enable USB debugging on your device
3. Open Chrome and go to: `chrome://inspect`
4. Click "inspect" on your app
5. Open Console tab to see JavaScript logs

## 📊 What the Logs Show

### When Payment is Initiated:
```
═══════════════════════════════════════════════════
[Checkout] 🛒 PLACE ORDER CLICKED
═══════════════════════════════════════════════════
[Checkout] Payment Method: online
[Checkout] Selected Address: {...}
[Checkout] Total: 100
...
═══════════════════════════════════════════════════
[Razorpay Service] 🚀 PAYMENT INITIATED
═══════════════════════════════════════════════════
[Razorpay Service] Platform: android
[Razorpay Service] Is Native Platform: true
[Razorpay Service] Razorpay Key ID: ✓ Present
[Razorpay Service] Payment Options: {...}
```

### Native Plugin Execution:
```
========================================
🚀 RAZORPAY NATIVE PLUGIN CALLED
========================================
✓ Activity available: MainActivity
----------------------------------------
📥 Received Parameters:
  Key: ✓ Present (rzp_live_S...)
  Name: Mornify
  Amount: 10000 paise (₹100.0)
  ...
----------------------------------------
⏳ Initializing Razorpay Checkout...
✓ Checkout instance created
✓ Key ID set successfully
🚀 Opening Razorpay Checkout UI...
```

### On Success:
```
========================================
✅ PAYMENT SUCCESS CALLBACK
========================================
Payment ID: pay_xxxxxxxxxxxxx
✓ Response sent successfully
```

### On Error:
```
========================================
❌ PAYMENT ERROR CALLBACK
========================================
Error Code: 2
Error Description: Payment cancelled by user
```

## 🐛 Common Issues to Look For

### 1. **Plugin Not Registered**
Look for: `❌ ERROR: Activity not available`
**Fix**: Ensure RazorpayNativePlugin is registered in MainActivity

### 2. **Missing Razorpay Key**
Look for: `❌ ERROR: Razorpay Key ID is null or empty`
**Fix**: Check `.env` file has `VITE_RAZORPAY_KEY_ID`

### 3. **Razorpay SDK Not Initialized**
Look for: `💥 EXCEPTION CAUGHT` with ClassNotFoundException
**Fix**: Ensure Razorpay SDK is in `build.gradle` dependencies

### 4. **Payment Callback Not Received**
Look for: Plugin opens but no success/error callback
**Fix**: Check MainActivity implements PaymentResultListener

### 5. **Amount Issues**
Look for: Amount in logs (should be in paise, e.g., 10000 for ₹100)
**Fix**: Ensure amount is multiplied by 100

## 🔧 Testing Steps

1. **Build and sync the app:**
   ```bash
   npm run android:sync
   ```

2. **Open Android Studio and run the app**

3. **Open Logcat and filter for "Razorpay"**

4. **In the app:**
   - Add items to cart
   - Go to checkout
   - Select "Online Payment"
   - Click "Proceed to Payment"

5. **Watch the logs in real-time** - you'll see:
   - ✅ Each step being executed
   - 📦 All data being passed
   - ⚠️ Any errors that occur
   - 🎯 Exact point of failure

## 📝 What to Share When Reporting Issues

When you encounter an error, share:

1. **Full log output** from the moment you click "Proceed to Payment"
2. **Screenshot** of the error (if any UI error appears)
3. **Device info**: Android version, device model
4. **Payment amount** being tested
5. **Any error messages** shown to the user

## ✅ Verification Checklist

Before testing, verify:

- [ ] Razorpay SDK dependency in `android/app/build.gradle`
- [ ] `VITE_RAZORPAY_KEY_ID` is set in `.env` file
- [ ] App is rebuilt after adding logging (`npm run android:sync`)
- [ ] USB debugging is enabled on device
- [ ] ADB can see your device (`adb devices`)

## 🎯 Current Configuration

- **Razorpay Key**: `rzp_live_Sg7NUOmg2vIEbu` (LIVE mode)
- **Environment**: Production
- **Platform**: Android Native SDK

## 📞 Next Steps

1. Run the app
2. Try to make a payment
3. Copy the logs from Logcat or ADB
4. Share the logs so we can identify the exact issue

The logs will show us exactly where the payment flow is breaking! 🔍
