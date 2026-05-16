# Phone Authentication System

## Overview
This implementation provides a complete phone authentication system with OTP verification for Indian phone numbers, ensuring users have verified phone numbers and addresses before making purchases.

## Features

### 1. Phone Authentication (`/auth/phone`)
- **Indian Phone Numbers Only**: Validates 10-digit Indian mobile numbers (starting with 6-9)
- **OTP Verification**: Sends 6-digit OTP via SMS using Supabase Auth
- **Remember Me**: Option to remember login for faster sign-in
- **Social Login**: Google and Email login options
- **Onboarding Carousel**: Engaging slides showcasing app features

### 2. User Profile (`/profile`)
- **Profile Picture**: Avatar with camera icon for future image upload
- **Editable Name**: Click to edit user name
- **Contact Information**: Display verified phone and email
- **Saved Addresses**: View and manage delivery addresses
- **Sign Out**: Secure logout functionality

### 3. Purchase Requirements
Before checkout, the system validates:
1. **Verified Phone Number**: User must complete OTP verification
2. **Delivery Address**: At least one saved address required

## Database Schema

### user_profiles Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- name: TEXT
- phone: TEXT (Verified phone number)
- avatar_url: TEXT (For future profile picture)
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

## Phone Number Validation

### Format
- **Country Code**: +91 (India)
- **Length**: 10 digits
- **Starting Digit**: Must be 6, 7, 8, or 9
- **Regex**: `/^[6-9]\d{9}$/`

### Examples
- ✅ Valid: 9876543210, 8765432109, 7654321098, 6543210987
- ❌ Invalid: 5432109876 (starts with 5), 98765 (too short), 987654321012 (too long)

## User Flow

### New User
1. Open app → Redirected to `/auth/phone`
2. Enter 10-digit phone number
3. Click "Continue" → OTP sent via SMS
4. Enter 6-digit OTP
5. Click "Verify OTP" → Account created
6. Redirected to `/address-map` to add first address
7. After adding address → Redirected to home

### Returning User
1. Open app → Auto-login if "Remember Me" was checked
2. Direct access to home page

### Checkout Flow
1. User adds items to cart
2. Clicks "Proceed to Checkout"
3. System checks:
   - Is user logged in? → If no, redirect to `/auth/phone`
   - Does user have verified phone? → If no, redirect to `/auth/phone`
   - Does user have address? → If no, redirect to `/address-map`
4. If all checks pass → Proceed to payment

## Components

### PhoneAuth.tsx
- Handles phone number input and validation
- Sends OTP via Supabase Auth
- Verifies OTP and creates user profile
- Manages authentication state
- Provides social login options

### Profile.tsx
- Displays user information
- Allows name editing
- Shows verified phone and email
- Lists saved addresses
- Provides sign-out functionality

## Setup Instructions

### 1. Enable Phone Auth in Supabase
```bash
# In Supabase Dashboard:
1. Go to Authentication → Providers
2. Enable Phone provider
3. Configure SMS provider (Twilio/MessageBird)
4. Add your SMS credentials
```

### 2. Run Database Migration
```bash
# Apply the user_profiles migration
psql -h your-db-host -U postgres -d your-db < android/supabase/migrations/create_user_profiles.sql
```

### 3. Configure Environment Variables
```env
# Already configured in your .env file
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Routes

- `/auth/phone` - Phone authentication page
- `/profile` - User profile page
- `/address-map` - Add/edit delivery addresses
- `/checkout` - Checkout page (requires phone + address)

## Security Features

1. **Row Level Security (RLS)**: Users can only access their own profile data
2. **Phone Verification**: OTP ensures phone number ownership
3. **Secure Storage**: Phone numbers stored encrypted in Supabase
4. **Session Management**: Automatic session handling via Supabase Auth

## Future Enhancements

1. **Profile Picture Upload**: Implement avatar_url functionality
2. **Phone Number Change**: Allow users to update verified phone
3. **Multiple Addresses**: Already supported, can be enhanced
4. **Address Verification**: Integrate with Google Maps API
5. **SMS Templates**: Customize OTP message templates

## Testing

### Test Phone Numbers (Supabase Test Mode)
When in development, you can use test phone numbers:
- Phone: +91 9999999999
- OTP: 123456

### Production Testing
1. Use your real phone number
2. Receive actual SMS OTP
3. Verify complete flow

## Troubleshooting

### OTP Not Received
- Check SMS provider configuration in Supabase
- Verify phone number format (+91XXXXXXXXXX)
- Check SMS provider credits/balance
- Review Supabase logs for errors

### Authentication Errors
- Clear browser cache and cookies
- Check Supabase project status
- Verify environment variables
- Review browser console for errors

## Support

For issues or questions:
1. Check Supabase Auth documentation
2. Review error logs in browser console
3. Check Supabase dashboard logs
4. Contact support team
