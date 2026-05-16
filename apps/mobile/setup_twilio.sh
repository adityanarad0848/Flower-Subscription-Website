#!/bin/bash

# Twilio Setup Script for Supabase Phone Auth
# This script will guide you through setting up Twilio

echo "================================================"
echo "  Twilio Setup for Supabase Phone Auth"
echo "================================================"
echo ""

# Check if user has Twilio account
echo "Do you have a Twilio account? (y/n)"
read -r has_account

if [ "$has_account" != "y" ]; then
    echo ""
    echo "📝 Step 1: Create a Twilio Account"
    echo "   1. Open: https://www.twilio.com/try-twilio"
    echo "   2. Sign up for a free account"
    echo "   3. Verify your email and phone"
    echo "   4. You'll get $15 free credit"
    echo ""
    echo "Press Enter when you've created your account..."
    read -r
fi

echo ""
echo "================================================"
echo "📋 Step 2: Get Your Twilio Credentials"
echo "================================================"
echo ""
echo "1. Go to: https://console.twilio.com/"
echo "2. You'll see your Account SID and Auth Token on the dashboard"
echo ""
echo "Enter your Twilio Account SID (starts with AC):"
read -r account_sid

echo ""
echo "Enter your Twilio Auth Token:"
read -r auth_token

echo ""
echo "================================================"
echo "📱 Step 3: Get a Phone Number or Messaging Service"
echo "================================================"
echo ""
echo "Option A: Use a Twilio Phone Number"
echo "   1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming"
echo "   2. Click 'Buy a number'"
echo "   3. Search for numbers with SMS capability"
echo "   4. Buy a number (uses your free credit)"
echo ""
echo "Option B: Create a Messaging Service (Recommended)"
echo "   1. Go to: https://console.twilio.com/us1/develop/sms/services"
echo "   2. Click 'Create Messaging Service'"
echo "   3. Name it 'Mornify SMS'"
echo "   4. Copy the Messaging Service SID (starts with MG)"
echo ""
echo "Which option do you prefer? (A/B)"
read -r option

if [ "$option" = "A" ] || [ "$option" = "a" ]; then
    echo ""
    echo "Enter your Twilio Phone Number (with country code, e.g., +1234567890):"
    read -r phone_number
    messaging_service_sid="$phone_number"
else
    echo ""
    echo "Enter your Messaging Service SID (starts with MG):"
    read -r messaging_service_sid
fi

echo ""
echo "================================================"
echo "✅ Configuration Summary"
echo "================================================"
echo ""
echo "Twilio Account SID: $account_sid"
echo "Twilio Auth Token: ${auth_token:0:10}..."
echo "Messaging Service SID/Phone: $messaging_service_sid"
echo ""

# Create configuration file
cat > twilio_config.txt << EOF
================================================
Supabase Phone Auth Configuration
================================================

Copy these values into your Supabase Dashboard:
(Authentication → Providers → Phone)

Enable Phone provider: ✅ ON

SMS provider: Twilio

Twilio Account SID:
$account_sid

Twilio Auth Token:
$auth_token

Twilio Message Service SID:
$messaging_service_sid

Twilio Content SID:
(Leave empty)

Enable phone confirmations: ✅ ON

SMS OTP Expiry: 60 seconds

SMS OTP Length: 6 digits

SMS Message:
Your Mornify verification code is {{ .Code }}

Test Phone Numbers and OTPs (for development):
+919999999999 = 123456

================================================
Next Steps:
================================================

1. Go to your Supabase Dashboard
2. Navigate to: Authentication → Providers → Phone
3. Copy the values above into the form
4. Click Save
5. Test with phone number: +919999999999
   OTP: 123456

================================================
EOF

echo "✅ Configuration saved to: twilio_config.txt"
echo ""
echo "📋 Next Steps:"
echo "   1. Open twilio_config.txt"
echo "   2. Copy the values into your Supabase Dashboard"
echo "   3. Go to: Authentication → Providers → Phone"
echo "   4. Paste the values and click Save"
echo ""
echo "🧪 Test Configuration:"
echo "   Phone: +919999999999"
echo "   OTP: 123456"
echo ""
echo "================================================"
