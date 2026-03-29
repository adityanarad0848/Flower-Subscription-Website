#!/bin/bash

echo "Running migration to add checkout columns to orders table..."

# Run migration using supabase CLI
npx supabase db push --db-url "postgresql://postgres.dzytzztohlvjwdsfhoua:Aditya@2580@aws-0-ap-south-1.pooler.supabase.com:6543/postgres"

echo "Migration complete!"
