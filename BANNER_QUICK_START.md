# 🎯 Quick Start: Restore Banner in 2 Minutes

## The Problem
Banner is not showing on the home page because the `banners` table doesn't exist in your Supabase database.

## The Solution (Choose One)

### ⚡ Option 1: Quick Setup (Fastest - 1 minute)

1. Open [Supabase SQL Editor](https://app.supabase.com)
2. Copy & paste contents of `quick_banner_setup.sql`
3. Click **Run**
4. Refresh your app → Banner appears! ✨

### 📚 Option 2: Full Setup with Examples (2 minutes)

1. Open [Supabase SQL Editor](https://app.supabase.com)
2. Copy & paste contents of `supabase/migrations/create_banners_table.sql`
3. Click **Run**
4. You get 3 example banners (Navratri, Diwali, Holi)

### ✅ Option 3: Verify Existing Setup

Already ran the migration? Check if it worked:
1. Run `verify_banner_setup.sql` in Supabase SQL Editor
2. It will show you the status of your banner setup

## What You'll Get

After running the setup, you'll see a beautiful animated banner on your home page with:
- 🌺 Animated flower emojis
- 🎨 Gradient background
- ✨ Pulsing effects
- 📱 Mobile responsive
- 🎯 Click to scroll to products

## Files Created

| File | Purpose |
|------|---------|
| `quick_banner_setup.sql` | ⚡ Fastest way - Creates table + 1 active banner |
| `supabase/migrations/create_banners_table.sql` | 📚 Full setup with 3 example banners |
| `verify_banner_setup.sql` | ✅ Check if setup is working |
| `RESTORE_BANNER_GUIDE.md` | 📖 Complete documentation |

## Next Steps

1. ✅ Run one of the SQL scripts above
2. 🎨 Customize banner at `/admin/banners`
3. 📅 Set up seasonal banners
4. 🚀 Deploy to production

## Need Help?

See `RESTORE_BANNER_GUIDE.md` for:
- Detailed troubleshooting
- How to create custom banners
- Admin panel usage
- Festival banner examples

---

**Quick Test:**
After running the SQL, visit http://localhost:5173 and you should see the banner! 🎉
