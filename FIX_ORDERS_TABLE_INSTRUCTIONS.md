# Fix Orders Table - Missing Columns

## Error
`Could not find the 'delivery_fee' column of 'orders' in the schema cache`

## Solution

The orders table is missing several columns needed for checkout. Follow these steps:

### Option 1: Using Supabase Dashboard (RECOMMENDED)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `FIX_ORDERS_TABLE.sql`
6. Click **Run** or press `Ctrl+Enter`
7. Verify the columns were added (query result will show all columns)

### Option 2: Using Supabase CLI

```bash
cd /Users/adityanarad/Downloads/Everyday
npx supabase db push
```

### Option 3: Manual Column Addition

Go to Supabase Dashboard > Table Editor > orders table > Add these columns:

- `postal_code` - TEXT
- `items` - JSONB
- `subtotal` - NUMERIC (10,2)
- `delivery_fee` - NUMERIC (10,2) - Default: 0
- `handling_fee` - NUMERIC (10,2) - Default: 0
- `discount` - NUMERIC (10,2) - Default: 0
- `total` - NUMERIC (10,2)
- `special_requests` - TEXT
- `payment_method` - TEXT
- `payment_id` - TEXT

## Columns Being Added

| Column Name | Type | Default | Description |
|-------------|------|---------|-------------|
| postal_code | TEXT | - | Customer postal code |
| items | JSONB | - | Cart items as JSON |
| subtotal | DECIMAL(10,2) | - | Order subtotal |
| delivery_fee | DECIMAL(10,2) | 0 | Delivery charges |
| handling_fee | DECIMAL(10,2) | 0 | Handling charges |
| discount | DECIMAL(10,2) | 0 | Discount amount |
| total | DECIMAL(10,2) | - | Total order amount |
| special_requests | TEXT | - | Customer notes |
| payment_method | TEXT | - | Payment method used |
| payment_id | TEXT | - | PayUmoney transaction ID |

## After Running Migration

1. Refresh your app
2. Try checkout again
3. The error should be resolved

## Verification

Run this query to verify columns exist:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
ORDER BY ordinal_position;
```

You should see all the new columns listed.
