# Evrydayy - Flower Subscription App - Complete Project Summary

## 📱 Project Overview

**App Name**: Evrydayy  
**Package ID**: com.evrydayy.app  
**Type**: Hybrid Mobile App (Capacitor + React)  
**Platform**: Android (Primary), Web (PWA)  
**Business Model**: Flower subscription service with daily delivery  
**Location**: Visarjan area delivery

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend Framework**: React 18.3.1 + TypeScript
- **Build Tool**: Vite 6.3.5
- **Mobile Framework**: Capacitor 8.2.0 (Android)
- **UI Library**: Radix UI + Tailwind CSS 4.1.12
- **Routing**: React Router 7.13.0
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Authentication**: Supabase Auth + Google OAuth + Firebase Auth
- **Maps**: Google Maps API (@react-google-maps/api)
- **Email Service**: EmailJS
- **Payment Gateway**: PayUmoney (in progress)
- **State Management**: React Context API

### Project Structure
```
/Users/adityanarad/Downloads/Everyday/
├── android/                    # Capacitor Android project
│   ├── app/                   # Android app module
│   ├── backend/               # Node.js payment backend
│   └── supabase/migrations/   # Database migrations
├── src/
│   ├── app/
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers (Cart, Auth)
│   │   ├── lib/               # Utilities (supabase, firebase)
│   │   └── types/             # TypeScript types
│   ├── lib/                   # Shared libraries
│   └── styles/                # CSS files
├── supabase/                  # Supabase config & migrations
├── public/                    # Static assets
└── scripts/                   # Build & migration scripts
```

## 🗄️ Database Schema (Supabase PostgreSQL)

### Core Tables

#### 1. **products**
```sql
- id (UUID, PK)
- name (TEXT)
- description (TEXT)
- price (DECIMAL)
- sale_price (DECIMAL)
- image_url (TEXT)
- category (TEXT)
- weight (TEXT)
- discount (INT, default 0)
- rating (DECIMAL, default 4.5)
- review_count (INT, default 0)
- badge (TEXT)
- is_active (BOOLEAN, default true)
- created_at, updated_at (TIMESTAMP)
```

#### 2. **orders**
```sql
- id (UUID, PK)
- user_id (UUID, FK -> auth.users)
- customer_name, customer_email, customer_phone (TEXT)
- address, city, state, pincode, postal_code (TEXT)
- items (JSONB) - cart items array
- subtotal, delivery_fee, handling_fee, discount, total (DECIMAL)
- delivery_date (DATE)
- special_requests (TEXT)
- payment_method (TEXT) - 'cod', 'gpay', 'phonepe', etc.
- payment_id (TEXT)
- status (TEXT) - 'pending', 'confirmed', 'completed', 'failed'
- created_at, updated_at (TIMESTAMP)
```

#### 3. **user_subscriptions**
```sql
- id (UUID, PK)
- user_id (UUID, FK -> auth.users)
- product_id (UUID)
- product_name (TEXT)
- start_date, end_date (TIMESTAMP)
- duration (TEXT) - 'week' or 'month'
- price (DECIMAL)
- status (TEXT) - 'active', 'paused', 'cancelled'
- paused_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

#### 4. **user_addresses**
```sql
- id (UUID, PK)
- user_id (UUID, FK -> auth.users)
- name, phone (TEXT)
- address_line1, address_line2 (TEXT)
- city, state, pincode (TEXT)
- latitude, longitude (DECIMAL)
- is_default (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

#### 5. **banners**
```sql
- id (UUID, PK)
- title, subtitle (TEXT)
- image_url (TEXT)
- link_url (TEXT)
- button_text (TEXT)
- is_active (BOOLEAN)
- display_order (INT)
- created_at, updated_at (TIMESTAMP)
```

#### 6. **subscription_paused_dates**
```sql
- id (UUID, PK)
- subscription_id (UUID, FK -> user_subscriptions)
- paused_date (DATE)
- reason (TEXT)
- created_at (TIMESTAMP)
```

## 🔐 Authentication Flow

### Supported Methods
1. **Email/Password** - Supabase Auth
2. **Google OAuth** - Firebase + Supabase integration
3. **OTP Login** - Phone number verification (via Supabase functions)

### User Profile Storage
- **auth.users** - Supabase managed auth table
- **user_profiles** - Custom profile data (full_name, phone, address)

### Auth Context
- **AuthProvider** wraps entire app in `App.tsx`
- **useAuth()** hook provides: `{ user, loading }`
- Session persistence via Supabase client
- Auth state listener for real-time updates

### Splash Screen Logic
- Shows for minimum 2.5 seconds
- Waits for auth loading to complete
- Only shows once per session (sessionStorage flag)
- Managed in `Root.tsx` component

## 🛒 Shopping & Subscription Flow

### 1. Product Browsing
- Home page displays products with 30% discount badge
- Categories: Flowers, Garlands, Puja Items
- Product cards show: image, name, price, rating, category badge

### 2. Subscription Selection
- **Trial Plan**: 1 week (7 days) - FREE
- **Monthly Plan**: 30 days - ₹(price × 30)
- User selects start date via custom calendar
- System auto-calculates end date
- Selected dates show in green gradient

### 3. Cart Management
- Items stored in localStorage + React Context
- Cart shows: product details, quantity, subscription dates
- Pricing breakdown:
  - Subtotal (sum of items)
  - Delivery Fee: FREE
  - Handling Fee: ₹3
  - Discount: 5% off subtotal
  - Total = Subtotal + Handling - Discount

### 4. Checkout Process
- **Address Selection**: Choose from saved addresses or add new via Google Maps
- **Special Requests**: Optional delivery instructions
- **Payment Methods**:
  - UPI: Google Pay, PhonePe, Paytm, Other UPI
  - Wallets: Paytm Wallet, Amazon Pay
  - Cards: Credit/Debit/ATM (Visa, Mastercard, RuPay)
  - Net Banking: All major banks
  - Cash on Delivery (COD)

### 5. Order Creation
- Order created with status:
  - **'confirmed'** for COD orders (immediate)
  - **'pending'** for online payments (until payment success)
- Subscription created with status **'active'**
- Email confirmation sent via EmailJS

## 📅 Subscription Management

### Active Subscriptions
- View all active/paused subscriptions in Account → Plans tab
- Each subscription shows:
  - Product name & image
  - Duration (week/month)
  - Start & end dates
  - Status badge (Active/Paused)
  - Price

### Pause Delivery (No Delivery Dates)
- **ManageDatesDialog** component
- Simple click-toggle calendar:
  - Click date → Mark as "No Delivery" (red color)
  - Click again → Unmark
- Dates stored in **subscription_paused_dates** table
- Red theme with "🚫 No Delivery" indicator

### Calendar Features
- **SubscriptionDialog**: Green gradient for selected subscription dates
- **ManageDatesDialog**: Red color for paused/no-delivery dates
- Custom calendar grid (no third-party library)
- Month navigation with ChevronLeft/Right
- Disabled past dates

## 🎨 UI/UX Design Decisions

### Splash Screen
- **Design**: Clean minimal white background
- **Logo**: Colorful flower petals (100×100 SVG)
- **Text**: "Evrydayy" in gray-900, "Delivery to Visarjan" tagline
- **Duration**: 2.5 seconds
- **No Onboarding**: App goes directly from splash → home

### Color Scheme
- **Primary**: Orange-500 to Pink-600 gradient
- **Success/Active**: Green-500 to Emerald-600
- **Warning/No Delivery**: Red-500
- **Discount Badge**: Red-500 with -30%
- **Category Badges**: Dynamic colors per category

### Removed Features
- ❌ Footer completely removed from all pages
- ❌ "+30 days" button removed from cart
- ❌ Onboarding screen deleted
- ❌ Delivery date selection removed from checkout

### Enhanced Features
- ✅ Delete address button: Red styling for visibility
- ✅ Subscription dates: Larger font (text-sm)
- ✅ Address cards: Orange border when selected
- ✅ Skeleton loading for addresses & subscriptions
- ✅ Visibility change listeners for auto-reload

## 🔧 Key Components

### Core Pages
1. **Home.tsx** - Product grid, banners, subscription dialog
2. **Cart.tsx** - Cart items, pricing, checkout button
3. **Checkout.tsx** - Address selection, payment methods, order placement
4. **Account.tsx** - User profile, orders, subscriptions, addresses
5. **AddressMap.tsx** - Google Maps integration for address selection
6. **ManageDatesDialog.tsx** - Calendar for pausing delivery dates
7. **SubscriptionDialog.tsx** - Calendar for selecting subscription start date

### Reusable Components
- **ProductCard.tsx** - Product display with add to cart
- **Header.tsx** - Navigation, cart icon, user menu
- **SplashScreen.tsx** - App loading screen
- **Auth.tsx** - Login/signup forms
- **AddressManager.tsx** - CRUD for user addresses

## 🚀 Build & Deployment

### Development
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite)
```

### Android Build
```bash
npm run build                    # Build React app
npx cap sync android             # Sync to Android
npx cap open android             # Open in Android Studio
# OR combined:
npm run android:sync             # Build + sync
npm run android:build            # Build + sync + gradlew assembleDebug
```

### Build Output
- **Web**: `dist/` folder
- **Android**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Important Build Notes
- Always run `npm run build && npx cap sync android` after code changes
- Rebuild in Android Studio for APK generation
- Large chunk warning (712KB) - consider code splitting for production

## 🔑 Environment Variables (.env)

```env
# Supabase
VITE_SUPABASE_URL=https://dzytzztohlvjwdsfhoua.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_UGOMx9DGN9ceszOVP8veKA_5O5Bbncu

# Google OAuth
VITE_GOOGLE_CLIENT_ID=435258521693-tr16p5lg6n5l8p5bm6eia6lfh0u6icf1.apps.googleusercontent.com

# Google Maps
VITE_GOOGLE_MAPS_API_KEY=AIzaSyBF66FDc1LzHX4tBKxY6LwGPG2cZHvLkWg

# Firebase
VITE_FIREBASE_API_KEY=AIzaSyA8sEAjmnCjQC1tjUvwJiFrOSxGE_iEdVE
VITE_FIREBASE_AUTH_DOMAIN=evryday-6873f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=evryday-6873f

# EmailJS
VITE_EMAILJS_PUBLIC_KEY=1OBvnsJdSCNpFvbRC
VITE_EMAILJS_SERVICE_ID=service_ny8xprl
VITE_EMAILJS_TEMPLATE_ID=template_k4r2j1s

# PayUmoney Backend
VITE_PAYUMONEY_BACKEND_URL=http://localhost:3000
```

## 🔑 PayUmoney Backend Credentials (android/backend/.env)

```env
# PayUmoney Credentials - CONFIGURED ✅
MERCHANT_KEY=B9RuCQ
MERCHANT_SALT=iLemnRL9Xb0B9aRg8mxUySXJ475OyPD0
MERCHANT_ID=9219578

# Server Configuration
PORT=3000

# Environment (sandbox or production)
PAYUMONEY_ENV=sandbox
```

## 🐛 Known Issues & Fixes

### Issue 1: Missing Columns in Orders Table
**Problem**: Orders table missing columns (pincode, postal_code, items, subtotal, etc.)  
**Fix**: Run migration `supabase/migrations/add_checkout_columns_to_orders.sql`

### Issue 2: Subscriptions Not Showing
**Problem**: Active subscriptions not appearing in Account page  
**Root Cause**: 
- Orders created with status='pending' instead of 'confirmed'
- Subscriptions created correctly with status='active'
**Fix**: Changed order creation to set status='confirmed' for COD orders immediately

### Issue 3: Items Parsing Error
**Problem**: JSON parsing error for order items in Account page  
**Fix**: Added try-catch to handle both JSON string and array formats

### Issue 4: Checkout Redirect Loop
**Problem**: Checkout redirecting to address-map when phone/address missing  
**Fix**: Removed redirect, use default values (phone='0000000000', pincode='000000')

### Issue 5: Splash Screen Shows Every Time
**Problem**: Splash screen appears on every page navigation  
**Fix**: Added sessionStorage flag to show splash only once per session

## 🔧 Troubleshooting Guide

### Build Issues

**Problem**: "Module not found" errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Capacitor sync fails
```bash
# Solution: Clean and rebuild
rm -rf android/app/build
npm run build
npx cap sync android --force
```

**Problem**: Android build fails in Android Studio
```bash
# Solution: Clean Gradle cache
cd android
./gradlew clean
./gradlew assembleDebug
```

### Runtime Issues

**Problem**: White screen on app launch
- Check browser console for errors
- Verify .env file exists and has correct values
- Check Supabase connection: `supabase.auth.getSession()`

**Problem**: Orders not creating
- Open browser DevTools → Console
- Look for "=== PLACE ORDER CLICKED ===" log
- Check for database column errors
- Verify user is authenticated
- Check Supabase logs in dashboard

**Problem**: Subscriptions not appearing
- Check order status (should be 'confirmed' not 'pending')
- Verify subscription created: `SELECT * FROM user_subscriptions WHERE user_id = 'xxx'`
- Check subscription status is 'active' or 'paused'
- Look for console errors in Account page

**Problem**: Payment not working
- Verify PayUmoney backend is running: `http://localhost:3000`
- Check backend logs for errors
- Verify merchant credentials in `android/backend/.env`
- Test hash generation endpoint

**Problem**: Google Maps not loading
- Verify API key in .env: `VITE_GOOGLE_MAPS_API_KEY`
- Check API key has Maps JavaScript API enabled
- Check browser console for API errors
- Verify billing is enabled on Google Cloud

**Problem**: Emails not sending
- Check EmailJS dashboard for quota
- Verify service ID, template ID, public key
- Check browser console for EmailJS errors
- Test with EmailJS dashboard test feature

### Database Issues

**Problem**: RLS policy blocking queries
```sql
-- Check if user is authenticated
SELECT auth.uid();

-- Temporarily disable RLS for testing (NOT for production)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

**Problem**: Migration failed
- Check Supabase dashboard → Database → Migrations
- Look for error messages
- Run migration manually in SQL editor
- Check for duplicate column/table names

### Performance Issues

**Problem**: Slow page load
- Check bundle size: `npm run build` (look for chunk warnings)
- Implement code splitting with React.lazy()
- Optimize images (compress, use WebP)
- Enable Vite build optimizations

**Problem**: Slow database queries
- Add indexes on frequently queried columns
- Use `.select('specific,columns')` instead of `.select('*')`
- Implement pagination for large datasets
- Check Supabase dashboard for slow queries

## 📊 Performance Optimization Tips

### Frontend
1. **Code Splitting**: Use React.lazy() for route-based splitting
2. **Image Optimization**: Compress images, use modern formats (WebP)
3. **Bundle Size**: Current main chunk is 712KB - consider splitting
4. **Caching**: Service worker caches key routes for offline access
5. **Lazy Loading**: Load images only when visible (intersection observer)

### Database
1. **Indexes**: Already created on user_id, created_at, order_id
2. **Query Optimization**: Use specific column selection
3. **RLS Policies**: Optimized to use indexes
4. **Connection Pooling**: Supabase handles automatically

### API Calls
1. **Debouncing**: Implement for search/autocomplete
2. **Caching**: Store frequently accessed data in localStorage
3. **Batch Requests**: Combine multiple queries when possible
4. **Pagination**: Implement for orders and subscriptions lists

## 🔐 Security Best Practices

### Implemented
- ✅ Row Level Security (RLS) on all tables
- ✅ User can only access their own data
- ✅ API keys stored in .env (not committed to git)
- ✅ Payment hash verification on backend
- ✅ HTTPS enforced by Supabase
- ✅ Auth tokens managed by Supabase

### Recommendations
1. **Environment Variables**: Never commit .env to git
2. **API Keys**: Rotate keys periodically
3. **Payment Security**: Always verify payment hash on backend
4. **Input Validation**: Sanitize user inputs before database insertion
5. **CORS**: Configure backend to only accept requests from your domain
6. **Rate Limiting**: Implement on backend API endpoints
7. **SQL Injection**: Use parameterized queries (Supabase handles this)

## 💻 Development Workflow

### Daily Development
1. Pull latest code: `git pull`
2. Install dependencies: `npm install` (if package.json changed)
3. Start dev server: `npm run dev`
4. Make changes in `src/` folder
5. Test in browser: `http://localhost:5173`
6. Commit changes: `git add . && git commit -m "message"`

### Testing on Android
1. Build React app: `npm run build`
2. Sync to Android: `npx cap sync android`
3. Open Android Studio: `npx cap open android`
4. Connect device or start emulator
5. Click Run (green play button)
6. Test on device

### Deploying Changes
1. Test thoroughly on dev
2. Build production: `npm run build`
3. Sync to Android: `npx cap sync android`
4. Open Android Studio
5. Build → Generate Signed Bundle/APK
6. Select APK, release variant
7. Sign with keystore
8. Upload to Play Store or distribute

### Database Changes
1. Create migration file in `supabase/migrations/`
2. Test locally if using Supabase CLI
3. Run in Supabase dashboard SQL editor
4. Verify changes in Table Editor
5. Update TypeScript types if needed
6. Test affected features

## 📚 Additional Resources

### Documentation Links
- **Supabase Docs**: https://supabase.com/docs
- **Capacitor Docs**: https://capacitorjs.com/docs
- **React Router**: https://reactrouter.com/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Radix UI**: https://www.radix-ui.com/
- **Google Maps API**: https://developers.google.com/maps/documentation
- **EmailJS**: https://www.emailjs.com/docs/
- **PayUmoney**: https://www.payumoney.com/dev-guide/

### Useful Commands
```bash
# Development
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run android:sync           # Build + sync to Android
npm run android:open           # Open Android Studio

# Capacitor
npx cap sync                   # Sync web to native
npx cap sync android           # Sync to Android only
npx cap open android           # Open in Android Studio
npx cap doctor                 # Check Capacitor setup

# Android
cd android && ./gradlew clean  # Clean build
cd android && ./gradlew assembleDebug  # Build debug APK

# Database (if using Supabase CLI)
supabase start                 # Start local Supabase
supabase db reset              # Reset local database
supabase migration new name    # Create new migration
```

## 🐛 Known Issues & Fixes

### Issue 1: Missing Columns in Orders Table
**Problem**: Orders table missing columns (pincode, postal_code, items, subtotal, etc.)  
**Fix**: Run migration `supabase/migrations/add_checkout_columns_to_orders.sql`

### Issue 2: Subscriptions Not Showing
**Problem**: Active subscriptions not appearing in Account page  
**Root Cause**: 
- Orders created with status='pending' instead of 'confirmed'
- Subscriptions created correctly with status='active'
**Fix**: Changed order creation to set status='confirmed' for COD orders immediately

### Issue 3: Items Parsing Error
**Problem**: JSON parsing error for order items in Account page  
**Fix**: Added try-catch to handle both JSON string and array formats

### Issue 4: Checkout Redirect Loop
**Problem**: Checkout redirecting to address-map when phone/address missing  
**Fix**: Removed redirect, use default values (phone='0000000000', pincode='000000')

## 📊 Business Logic

### Pricing
- All products have 30% discount applied
- Display price = Original price × 0.7
- Subscription pricing:
  - Weekly trial: FREE (₹0)
  - Monthly: Product price × 30 days

### Delivery
- Delivery fee: FREE (₹0)
- Handling fee: ₹3 (fixed)
- Discount: 5% off subtotal
- Delivery area: Visarjan (configurable)

### Order Status Flow
```
COD Orders:
pending → confirmed → delivered

Online Payment Orders:
pending → (payment) → completed → delivered
         ↓ (failed)
         failed
```

### Subscription Status Flow
```
active → paused → active
       ↓
       cancelled (end date reached)
```

## 📝 Important Files

### Configuration
- `capacitor.config.json` - Capacitor app config (appId, appName, webDir)
- `package.json` - Dependencies & scripts
- `vite.config.ts` - Vite build config (React, Tailwind, path aliases)
- `.env` - Environment variables (API keys, service URLs)
- `manifest.json` - PWA manifest (app metadata, icons, theme)
- `sw.js` - Service worker (caching strategy)

### Database
- `supabase/migrations/` - All database migrations
- `android/supabase/migrations/add_checkout_columns_to_orders.sql` - Critical order table fix

### Key Components
- `src/app/App.tsx` - Root app component with AuthProvider
- `src/app/components/Root.tsx` - Layout with splash, header, CartProvider
- `src/app/components/Checkout.tsx` - Order creation logic (CRITICAL)
- `src/app/components/Account.tsx` - User dashboard with subscriptions
- `src/app/components/ManageDatesDialog.tsx` - Pause delivery calendar
- `src/app/components/SubscriptionDialog.tsx` - Subscription start date picker
- `src/app/components/AddressMap.tsx` - Google Maps address selection
- `src/app/components/Home.tsx` - Product listing & subscription flow
- `src/app/context/cart.tsx` - Cart state management (CRITICAL)
- `src/app/context/auth.tsx` - Auth state management (CRITICAL)

### Backend
- `android/backend/server.js` - PayUmoney payment backend (Node.js) ✅ CONFIGURED
- `android/backend/.env` - Payment gateway credentials ✅ CREDENTIALS ADDED
- `start-payment-backend.sh` - Script to start payment server ✅ NEW

### Documentation
- `PROJECT_SUMMARY.md` - This comprehensive guide (MOST IMPORTANT)
- `PAYUMONEY_SETUP_COMPLETE.md` - PayUmoney integration guide ✅ NEW
- `README.md` - Basic setup instructions
- `DATABASE_SETUP.md` - Database configuration guide
- `BUILD_APK.md` - Android build instructions
- `PAYUMONEY_INTEGRATION.md` - Payment gateway setup
- `DEFECT_FIXES.md` - Bug fixes documentation
- `CHECKOUT_BACKEND_FIXES.md` - Checkout flow fixes

## 🌐 PWA (Progressive Web App) Features

### Service Worker
- **Cache Strategy**: Network-first, fallback to cache
- **Cached Routes**: /, /subscriptions, /products, /how-it-works
- **Cache Name**: bloombox-v1
- **Auto-cleanup**: Old caches removed on activation

### Manifest (manifest.json)
- **App Name**: Evrydayy - Fresh Puja Flowers Delivery
- **Theme Color**: #f97316 (Orange)
- **Display Mode**: Standalone
- **Orientation**: Portrait-primary
- **Icons**: 192x192, 512x512 (maskable)
- **Categories**: Shopping, Lifestyle

### Install Prompt
- **Component**: PWAInstallPrompt.tsx
- Shows native install banner on supported browsers
- Dismissible by user
- Respects user's previous dismissal

## 💳 Payment Integration

### PayUmoney Backend (Node.js)
- **Location**: `android/backend/server.js`
- **Port**: 3000 (configurable)
- **Dependencies**: Express, CORS, dotenv, crypto

### API Endpoints
1. **POST /api/payment/generate-hash**
   - Generates SHA-512 hash for payment
   - Input: txnId, amount, productInfo, firstName, email, phone
   - Output: hash, merchantKey, merchantId

2. **POST /api/payment/success**
   - Verifies payment success callback
   - Validates hash to prevent tampering
   - Returns: success status, transactionId

3. **POST /api/payment/failure**
   - Handles payment failure callback
   - Logs failure reason
   - Returns: failure status, transactionId

### Payment Methods Supported
- **All methods via PayUmoney UI**:
  - UPI: Google Pay, PhonePe, Paytm, BHIM, Amazon Pay
  - Cards: Visa, Mastercard, RuPay, Amex (Credit/Debit/ATM)
  - Net Banking: All major Indian banks
  - Wallets: Paytm Wallet, Mobikwik, Freecharge
  - EMI: Credit card EMI options
- **No COD**: Removed from checkout
- **No Payment Selection**: User clicks "Proceed to Payment" → PayUmoney UI opens

### Payment Flow
1. User selects items and goes to checkout
2. User selects delivery address
3. User clicks "Proceed to Payment" button
4. Order created with status='pending'
5. Frontend calls backend `/generate-hash`
6. Backend returns hash + merchant details
7. PayUmoney UI opens with all payment options
8. User completes payment in PayUmoney
9. PayUmoney calls success/failure callback
10. Backend verifies hash and updates order status
11. Order status updated to 'completed' or 'failed'
12. User redirected to success/failure page
13. Subscription created with status='active' (if applicable)

## 🎯 Feature Checklist

### ✅ Completed Features
- [x] Product catalog with categories
- [x] Shopping cart with persistence
- [x] Subscription plans (weekly trial, monthly)
- [x] User authentication (Email, Google, OTP)
- [x] Address management with Google Maps
- [x] Order placement with PayUmoney integration
- [x] Active subscription management
- [x] Pause delivery dates (no delivery calendar)
- [x] Order history
- [x] Email notifications
- [x] Splash screen
- [x] PWA support
- [x] Admin banner management
- [x] Skeleton loading states
- [x] Auto-reload on page visibility
- [x] PayUmoney payment gateway (fully integrated)

### 🚧 In Progress
- [ ] Payment history tracking
- [ ] Wallet/credits system

### 📋 Future Enhancements
- [ ] Push notifications
- [ ] Referral system
- [ ] Loyalty points
- [ ] Multiple delivery slots
- [ ] Product reviews & ratings
- [ ] Wishlist
- [ ] Order tracking
- [ ] Admin dashboard

## 🗺️ Google Maps Integration

### Address Selection Flow
1. User clicks "Add Address" in checkout/addresses
2. Navigates to `/address-map` route
3. Google Maps loads with current location
4. User can:
   - Search for location (autocomplete)
   - Drag map to select location
   - Marker shows selected position
5. User fills address form (name, phone, address lines)
6. Saves to `user_addresses` table with lat/lng
7. Redirects back to previous page

### Map Configuration
- **API Key**: Stored in VITE_GOOGLE_MAPS_API_KEY
- **Library**: @react-google-maps/api
- **Default Center**: User's current location (geolocation API)
- **Zoom Level**: 15 (street level)
- **Marker**: Draggable, shows selected location

### Address Storage
- Includes latitude & longitude for future delivery routing
- Supports multiple addresses per user
- One address can be marked as default
- Used for delivery location in orders

## 📧 Email Notifications (EmailJS)

### Configuration
- **Service**: EmailJS (service_ny8xprl)
- **Template**: template_k4r2j1s
- **Public Key**: 1OBvnsJdSCNpFvbRC

### Email Triggers
1. **Order Confirmation** - Sent after successful order placement
2. **Order Status Updates** - When order status changes
3. **Subscription Reminders** - Before subscription renewal

### Email Content
- Order details (items, total, delivery address)
- Customer information
- Payment method
- Delivery date
- Order tracking link (future)

### Rate Limits
- Free tier: 200 emails/month
- Consider upgrading for production

## 🔄 Common Development Tasks

### Add New Product
1. Insert into `products` table via Supabase dashboard
2. Product auto-appears on home page

### Add New Migration
1. Create SQL file in `supabase/migrations/`
2. Run via Supabase dashboard or CLI

### Update Order Status
```sql
UPDATE orders SET status = 'confirmed' WHERE id = 'order-uuid';
```

### Check Active Subscriptions
```sql
SELECT * FROM user_subscriptions 
WHERE user_id = 'user-uuid' 
AND status IN ('active', 'paused')
ORDER BY created_at DESC;
```

### Debug Order Creation
- Check browser console for logs: "=== PLACE ORDER CLICKED ==="
- Verify order payload in console
- Check Supabase logs for insert errors

## 📞 Support & Contact

### Developer Notes
- Always test on Android device after changes
- Use Chrome DevTools for mobile debugging
- Check Supabase logs for backend errors
- EmailJS has rate limits (200 emails/month free tier)

### Critical Paths
- **Order creation**: `Checkout.tsx` → `handlePlaceOrder()`
- **Subscription creation**: `Checkout.tsx` → subscription items filter
- **Cart management**: `cart.tsx` context
- **Address selection**: `AddressMap.tsx` → Google Maps
- **Auth flow**: `App.tsx` → `AuthProvider` → `Root.tsx` → `Header.tsx`
- **Payment flow**: `Checkout.tsx` → `PaymentService` → Backend → PayUmoney

### Context Providers Hierarchy
```
App.tsx
└── AuthProvider (auth state)
    └── RouterProvider
        └── Root.tsx
            └── CartProvider (cart state)
                └── Header + Outlet (pages)
```

### State Management
- **Global State**: React Context (Auth, Cart)
- **Local State**: useState hooks in components
- **Persistence**: 
  - Cart → localStorage
  - Auth → Supabase session
  - Splash shown → sessionStorage

### Routing Strategy
- **Library**: React Router v7
- **Type**: Browser Router (client-side)
- **Layout**: Root component with Header + Outlet
- **Protected Routes**: Check auth in component useEffect
- **Redirects**: navigate() from useNavigate hook

---

## 🎓 Quick Start for New Developers

1. **Clone & Install**
   ```bash
   cd /Users/adityanarad/Downloads/Everyday
   npm install
   ```

2. **Setup Environment**
   - Copy `.env` file (already configured)
   - Verify Supabase connection

3. **Run Development**
   ```bash
   npm run dev
   # Open http://localhost:5173
   ```

4. **Build for Android**
   ```bash
   npm run android:sync
   npx cap open android
   # Build APK in Android Studio
   ```

5. **Database Setup**
   - All migrations already run on Supabase
   - Check tables in Supabase dashboard

---

**Last Updated**: January 2025  
**Version**: 0.0.1  
**Status**: Active Development  
**Primary Developer**: Aditya Narad

Now you can rebuild anytime with: cd android && ./gradlew clean assembleDebug
Important: Every time you run npx cap sync, this file gets overwritten. Always re-add the PayUMoney entry after syncing.