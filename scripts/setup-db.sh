#!/bin/bash

# Supabase Database Setup Script
# This script helps you execute the SQL migrations for the subscription system

set -e

echo "🌸 Flower Subscription Platform - Database Setup"
echo "=================================================="
echo ""

# Check for Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI not found."
    echo ""
    echo "Option 1: Install Supabase CLI"
    echo "  npm install -g supabase"
    echo ""
    echo "Option 2: Manual Setup (Recommended for first-time)"
    echo "  1. Go to https://app.supabase.com"
    echo "  2. Select your project"
    echo "  3. Navigate to SQL Editor"
    echo "  4. Create a new query"
    echo "  5. Copy contents from: supabase/migrations/create_subscription_tables.sql"
    echo "  6. Click Run"
    echo "  7. Create another query with: supabase/migrations/seed_subscription_data.sql"
    echo "  8. Click Run"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found!"
echo ""

# Push migrations
echo "📝 Running migrations..."
supabase db push

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📊 Summary:"
echo "  - Created subscription_plans table (3 plans)"
echo "  - Created flower_bundles table (12 bundles)"
echo "  - Created user_subscriptions table"
echo "  - Created delivery_schedules table"
echo "  - Enabled Row Level Security (RLS)"
echo ""
echo "🚀 Next steps:"
echo "  1. Update your .env.local with Supabase credentials"
echo "  2. Run: npm run dev"
echo "  3. Navigate to /subscriptions to see your plans"
echo ""
