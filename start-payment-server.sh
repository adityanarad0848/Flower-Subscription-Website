#!/bin/bash

echo "🚀 Starting PayUmoney Backend Server..."
echo ""
echo "⚠️  IMPORTANT: Update your credentials in android/backend/.env"
echo ""
echo "Current credentials:"
grep "MERCHANT_KEY\|MERCHANT_SALT\|MERCHANT_ID" android/backend/.env
echo ""
echo "Starting server on http://localhost:3000"
echo ""

cd android/backend && npm start
