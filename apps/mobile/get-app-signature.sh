#!/bin/bash

# Script to get Android App Signature Hash for WhatsApp Authentication

echo "=========================================="
echo "Getting Android App Signature Hash"
echo "=========================================="
echo ""

# Check if keytool is available
if ! command -v keytool &> /dev/null; then
    echo "❌ Error: keytool not found"
    echo "Please install Java JDK"
    exit 1
fi

echo "📱 App Package: com.evrydayy.app"
echo ""

# For Debug Keystore
echo "🔧 Debug Keystore Signature:"
echo "----------------------------"

DEBUG_KEYSTORE="$HOME/.android/debug.keystore"

if [ -f "$DEBUG_KEYSTORE" ]; then
    keytool -exportcert -alias androiddebugkey -keystore "$DEBUG_KEYSTORE" -storepass android -keypass android | openssl dgst -sha256 | cut -d' ' -f2 | head -c 11
    echo ""
    echo ""
else
    echo "❌ Debug keystore not found at: $DEBUG_KEYSTORE"
    echo ""
fi

# For Release Keystore
echo "🚀 Release Keystore Signature:"
echo "------------------------------"
echo "If you have a release keystore, run:"
echo ""
echo "keytool -exportcert -alias YOUR_KEY_ALIAS -keystore /path/to/your/keystore.jks | openssl dgst -sha256 | cut -d' ' -f2 | head -c 11"
echo ""

echo "=========================================="
echo "✅ Copy the 11-character hash above"
echo "=========================================="
