# Complete User Flow Test Guide

## 🎯 Expected Flow:

### First Time User (No Account):
```
1. Open App
   ↓
2. Automatically redirected to Phone Auth Screen
   - Black background
   - Carousel: "400+ CRORE ORDERS DELIVERED"
   - Phone input with +91
   - Indian flag icon
   ↓
3. Enter Phone: 9999999999
   ↓
4. Click "Continue"
   ↓
5. OTP Screen appears
   - Enter OTP: 123456
   ↓
6. Click "Verify OTP"
   ↓
7. Automatically redirected to Google Maps
   - Map loads
   - Can drag pin
   - Shows serviceable areas
   ↓
8. Set Location on Map
   - Drag pin or tap map
   - Address auto-fills
   ↓
9. Fill Details:
   - Name: Your Name
   - Phone: 9876543210
   - Flat/Floor: (optional)
   - Save as: Home/Work/Other
   ↓
10. Click "Confirm Location"
    ↓
11. Redirected to Home Page
    ✅ Can now browse and shop!
```

### Returning User (Has Account + Address):
```
1. Open App
   ↓
2. Automatically logged in
   ↓
3. Home Page shown directly
   ✅ Ready to shop!
```

### User with Account but No Address:
```
1. Open App
   ↓
2. Checks authentication
   ↓
3. User is logged in ✓
   ↓
4. No address found
   ↓
5. Automatically redirected to Google Maps
   ↓
6. Add address
   ↓
7. Redirected to Home Page
```

## 🧪 Test Steps:

### Test 1: Complete New User Flow
```bash
# Clear all app data
adb shell pm clear com.evrydayy.app

# Open app
adb shell am start -n com.evrydayy.app/.MainActivity

# Expected: Phone Auth Screen appears immediately
```

**Then:**
1. Enter phone: `9999999999`
2. Enter OTP: `123456`
3. **Expected**: Google Maps opens
4. Set location and save
5. **Expected**: Home page appears

### Test 2: Returning User
```bash
# Don't clear data, just restart
adb shell am force-stop com.evrydayy.app
adb shell am start -n com.evrydayy.app/.MainActivity

# Expected: Home page appears directly (no auth screen)
```

### Test 3: User with Phone but No Address
```bash
# This would require manually deleting addresses from database
# Or testing with a new phone number
```

## 🐛 Troubleshooting:

### If Phone Auth doesn't show:
- Clear app data: `adb shell pm clear com.evrydayy.app`
- Restart app

### If Google Maps doesn't load after OTP:
- Check browser console for errors
- Verify Google Maps API key is set
- Check network connection

### If stuck in a loop:
- Clear app data
- Check Supabase connection
- Verify user_profiles table exists

## ✅ Success Criteria:

1. ✅ Phone auth shows on first launch
2. ✅ OTP verification works
3. ✅ Google Maps opens after OTP
4. ✅ Can set location and save
5. ✅ Redirected to home after saving address
6. ✅ Returning users go directly to home
7. ✅ Can browse products and add to cart
8. ✅ Checkout validates phone and address

## 📱 Current Status:

All components are in place:
- ✅ PhoneAuth component
- ✅ ProtectedRoute guard
- ✅ AddressMap component
- ✅ Profile component
- ✅ Checkout validation

The flow should work end-to-end now!
