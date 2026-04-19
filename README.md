# Mornify - Flower Subscription Platform

This monorepo contains both the website and mobile app for Mornify.

## Project Structure

```
Flower-Subscription-Website/
├── apps/
│   ├── website/          # Desktop website (mornify.in)
│   └── mobile/           # Android mobile app
└── README.md
```

## Website (Desktop Landing Page)

**Location:** `apps/website/`

**Development:**
```bash
cd apps/website
npm install
npm run dev
```

**Build:**
```bash
npm run build
# Output: apps/website/dist/
```

**Deploy:**
Automatically deploys to mornify.in via GitHub Actions

**Files:**
- `src/components/DesktopLanding.tsx` - Main landing page
- `src/main.tsx` - Entry point
- `index.html` - HTML template

---

## Mobile App (Android PWA)

**Location:** `apps/mobile/`

**Development:**
```bash
cd apps/mobile
npm install
npm run dev
```

**Build APK:**
```bash
npm run android:build
# Output: apps/mobile/android/app/build/outputs/apk/
```

**Files:**
- `src/app/components/` - All mobile components
- `android/` - Native Android configuration
- `capacitor.config.json` - Capacitor config

---

## Quick Commands

| Task | Command |
|------|---------|
| **Website dev** | `cd apps/website && npm run dev` |
| **Mobile dev** | `cd apps/mobile && npm run dev` |
| **Build website** | `cd apps/website && npm run build` |
| **Build Android APK** | `cd apps/mobile && npm run android:build` |

---

## Deployment

- **Website**: Auto-deploys to mornify.in on push to main
- **Mobile**: Build APK and upload to Play Store manually
