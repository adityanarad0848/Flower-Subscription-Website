#!/bin/bash

# Start PayUmoney Backend Server
echo "🚀 Starting PayUmoney Backend Server..."
echo "📍 Server will run on http://localhost:3000"
echo ""

cd "$(dirname "$0")/android/backend"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the server
echo "✅ Starting server..."
npm start
