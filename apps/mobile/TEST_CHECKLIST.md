# 🧪 Razorpay Payment Test Checklist

Use this checklist to systematically test and debug the Razorpay integration.

## Pre-Test Setup

- [ ] App rebuilt with new logging: `npm run android:sync`
- [ ] Device connected: `adb devices` shows your device
- [ ] Logs viewer ready: `./view-razorpay-logs.sh` running in terminal
- [ ] Test account logged in to app
- [ ] Test address added

## Test Scenario 1: Basic Payment Flow

### Steps:
1. [ ] Add a product to cart (use small amount like ₹10)
2. [ ] Navigate to checkout
3. [ ] Select delivery address
4. [ ] Select "Online Payment" method
5. [ ] Click "Proceed to Payment" button

### Expected Logs:
```
[Checkout] 🛒 PLACE ORDER CLICKED
[Checkout] Payment Method: online
[Razorpay Service] 🚀 PAYMENT INITIATED
[Razorpay Service] Platform: android
[Razorpay Service] Is Native Platform: true
🚀 RAZORPAY NATIVE PLUGIN CALLED
✓ Activity available
✓ Checkout instance created
🚀 Opening Razorpay Checkout UI...
```

### What to Check:
- [ ] Does the log show "PLACE ORDER CLICKED"?
- [ ] Does it show "PAYMENT INITIATED"?
- [ ] Does it show "RAZORPAY NATIVE PLUGIN CALLED"?
- [ ] Does Razorpay UI open on screen?
- [ ] Any error messages in logs?

### Record Results:
**What happened:**
```
[Write what you observed]
```

**Last successful log line:**
```
[Copy the last successful log line before error]
```

**Error (if any):**
```
[Copy any error messages]
```

---

## Test Scenario 2: Payment Completion

### Steps:
1. [ ] Complete Test Scenario 1 successfully
2. [ ] When Razorpay UI opens, try to complete payment
3. [ ] Use test card: 4111 1111 1111 1111, any future date, any CVV

### Expected Logs (Success):
```
========================================
✅ PAYMENT SUCCESS CALLBACK
========================================
Payment ID: pay_xxxxxxxxxxxxx
✓ Response sent successfully
[Checkout] ✅ PAYMENT SUCCESS
[Checkout] 🎉 Navigating to success page...
```

### Expected Logs (Failure):
```
========================================
❌ PAYMENT ERROR CALLBACK
========================================
Error Code: [number]
Error Description: [description]
```

### What to Check:
- [ ] Does payment complete successfully?
- [ ] Do you see success callback in logs?
- [ ] Does app navigate to success page?
- [ ] Is order marked as completed in database?

### Record Results:
**What happened:**
```
[Write what you observed]
```

**Payment ID (if successful):**
```
[Copy payment ID from logs]
```

**Error (if failed):**
```
[Copy error code and description]
```

---

## Test Scenario 3: Payment Cancellation

### Steps:
1. [ ] Start payment flow
2. [ ] When Razorpay UI opens, click back/cancel
3. [ ] Observe logs

### Expected Logs:
```
========================================
❌ PAYMENT ERROR CALLBACK
========================================
Error Code: 2
Error Description: Payment cancelled by user
```

### What to Check:
- [ ] Does cancellation trigger error callback?
- [ ] Does app show appropriate error message?
- [ ] Is order marked as failed in database?

### Record Results:
**What happened:**
```
[Write what you observed]
```

---

## Common Issues & Solutions

### Issue 1: "Activity not available"
**Symptom:** Log shows `❌ ERROR: Activity not available`
**Solution:** 
- Check MainActivity is properly initialized
- Ensure plugin is registered in onCreate

### Issue 2: "Razorpay Key ID is null"
**Symptom:** Log shows `❌ ERROR: Razorpay Key ID is null or empty`
**Solution:**
- Verify `.env` file has `VITE_RAZORPAY_KEY_ID`
- Rebuild app: `npm run android:sync`

### Issue 3: Razorpay UI doesn't open
**Symptom:** Logs show plugin called but no UI appears
**Solution:**
- Check for exceptions in logs
- Verify Razorpay SDK version in build.gradle
- Check if amount is valid (> 0)

### Issue 4: No callback received
**Symptom:** Payment completes but no success/error callback
**Solution:**
- Verify MainActivity implements PaymentResultListener
- Check if callbacks are properly forwarded to plugin

### Issue 5: ClassNotFoundException
**Symptom:** Exception about Razorpay class not found
**Solution:**
- Verify Razorpay dependency in build.gradle
- Clean and rebuild: `cd android && ./gradlew clean`

---

## Debug Information to Collect

When reporting the issue, include:

### 1. Environment Info
- [ ] Android version: ___________
- [ ] Device model: ___________
- [ ] App version: ___________

### 2. Complete Log Output
```
[Paste complete log output from when you click "Proceed to Payment" 
until the error occurs or payment completes]
```

### 3. Screenshots
- [ ] Screenshot of error (if visible on screen)
- [ ] Screenshot of checkout page before clicking payment

### 4. Test Details
- [ ] Test amount: ₹___________
- [ ] Payment method selected: ___________
- [ ] What happened: ___________

---

## Quick Commands Reference

```bash
# Rebuild app
npm run android:sync

# View logs (method 1)
./view-razorpay-logs.sh

# View logs (method 2)
adb logcat | grep -E "Razorpay|MainActivity|Checkout"

# Clear logs
adb logcat -c

# Check connected devices
adb devices

# Restart ADB
adb kill-server && adb start-server
```

---

## ✅ Test Complete

After completing all tests, you should have:
- [ ] Complete log output
- [ ] Clear understanding of where it fails
- [ ] Error messages (if any)
- [ ] Screenshots of the issue

**Share this information and I'll help you fix the issue!** 🎯
