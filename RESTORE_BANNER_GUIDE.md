# Restore Banner Image - Setup Guide

## Issue
The banner is not showing on the home page because the `banners` table doesn't exist in the Supabase database.

## Solution - Quick Setup (5 minutes)

### Step 1: Create the Banners Table in Supabase

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project (dzytzztohlvjwdsfhoua)

2. **Open SQL Editor**
   - Click on **SQL Editor** in the left sidebar
   - Click **New Query**

3. **Run the Migration**
   - Open the file: `/supabase/migrations/create_banners_table.sql`
   - Copy the entire contents
   - Paste into the Supabase SQL Editor
   - Click **Run** (or press Ctrl+Enter / Cmd+Enter)
   - Wait for the success message ✅

### Step 2: Verify the Table

1. Click **Table Editor** in the left sidebar
2. You should see a new table called `banners`
3. It should have 3 rows:
   - Navratri (Active)
   - Diwali (Inactive)
   - Holi (Inactive)

### Step 3: Test the Banner

1. Restart your dev server:
   ```bash
   npm run dev
   ```

2. Open http://localhost:5173 in your browser

3. You should now see the **Navratri banner** at the top of the home page with:
   - 🔱 Icon with animated flowers
   - "Navratri" title
   - "Divine Flowers for 9 Sacred Nights" subtitle
   - Orange-red gradient background
   - "Shop Navratri Flowers →" button

## Banner Features

### What You Get
- **Dynamic Festival Banners** - Change banners based on festivals
- **Auto-scheduling** - Banners show/hide based on start/end dates
- **Admin Panel** - Manage banners at `/admin/banners`
- **Multiple Gradients** - 5 pre-configured color schemes
- **Emoji Icons** - Use any emoji as the banner icon
- **Animated Effects** - Bouncing flowers, pulsing circles

### Managing Banners

#### Via Admin Panel (Recommended)
1. Navigate to http://localhost:5173/admin/banners
2. Use the form to create/edit banners
3. Toggle active/inactive status
4. Set start/end dates for auto-scheduling

#### Via Supabase Dashboard
1. Go to **Table Editor** → `banners`
2. Click on any row to edit
3. Toggle `is_active` to show/hide banners
4. Update dates, text, colors, etc.

## Banner Configuration Options

### Available Gradient Colors
- `from-orange-600 via-pink-600 to-red-600` (Default - Navratri)
- `from-purple-600 via-pink-600 to-red-600` (Purple theme)
- `from-blue-600 via-indigo-600 to-purple-600` (Cool theme)
- `from-green-600 via-teal-600 to-blue-600` (Fresh theme)
- `from-yellow-500 via-orange-500 to-red-500` (Warm theme)

### Popular Festival Emojis
- 🔱 Navratri (Trishul)
- 🪔 Diwali (Diya)
- 🎨 Holi (Colors)
- 🕉️ General Puja
- 🌺 Flowers
- ✨ Special Offers

## Creating New Banners

### Example: Create a Dussehra Banner

```sql
INSERT INTO banners (
  title,
  subtitle,
  description,
  badge_text,
  button_text,
  background_gradient,
  icon_emoji,
  is_active,
  start_date,
  end_date,
  display_order
) VALUES (
  'Dussehra',
  'Victory of Good Over Evil',
  'Fresh Flowers • Special Puja Kits • Festival Offers',
  'DUSSEHRA SPECIAL',
  'Shop Now →',
  'from-orange-600 via-pink-600 to-red-600',
  '🏹',
  true,
  '2024-10-10',
  '2024-10-25',
  1
);
```

## Troubleshooting

### Banner Not Showing?

**Check 1: Is the table created?**
```sql
SELECT * FROM banners WHERE is_active = true;
```
Should return at least one row.

**Check 2: Are dates valid?**
- `start_date` should be NULL or <= today
- `end_date` should be NULL or >= today

**Check 3: Check browser console**
- Open DevTools (F12)
- Look for any errors related to banners

**Check 4: Clear cache**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)

### Multiple Banners Showing?

Only the first active banner (by `display_order`) will show. To change:
1. Set `is_active = false` for unwanted banners
2. Or adjust `display_order` (lower number = higher priority)

### Banner Looks Wrong?

1. Check the `background_gradient` value matches one of the available options
2. Verify `icon_emoji` is a valid emoji
3. Ensure `title` and `subtitle` are not too long

## Next Steps

1. ✅ Create the banners table (Step 1)
2. ✅ Verify banner appears on home page
3. 🎨 Customize banner text/colors for your needs
4. 📅 Set up seasonal banners with start/end dates
5. 🔧 Use admin panel to manage banners easily

## Support

If you encounter issues:
1. Check Supabase logs: Dashboard → Logs
2. Verify RLS policies are enabled
3. Ensure you're authenticated when using admin panel
4. Check that the `banners` table has the correct schema

---

**Quick Test Command:**
```sql
-- Run this in Supabase SQL Editor to verify setup
SELECT title, is_active, start_date, end_date 
FROM banners 
ORDER BY display_order;
```

Expected output: 3 rows (Navratri, Diwali, Holi)
