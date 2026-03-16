# Copilot Instructions for Flower Subscription Website

## Project Overview

A Progressive Web App (PWA) flower subscription website built from a Figma design export. The app is a single-page application with four main routes displaying subscription and product information, with offline support and installability.

**Tech Stack:** React 18 + React Router 7 + Vite + Tailwind CSS + Radix UI

## Architecture

### Routing & Layout
- **Single Router**: Uses `react-router` v7 (not v6) - API differs significantly
- **Route Config**: [src/app/routes.ts](src/app/routes.ts) - centralized route definitions
- **Layout Structure**: [src/app/components/Root.tsx](src/app/components/Root.tsx) provides shared Header → Outlet → Footer wrapper
- **Navigation**: [src/app/components/Header.tsx](src/app/components/Header.tsx) manages nav state and active link detection using `useLocation()`

### Component Organization
- **Page Components**: `Home.tsx`, `Subscriptions.tsx`, `Products.tsx`, `HowItWorks.tsx` in [src/app/components/](src/app/components/)
- **UI Components**: All Radix UI-based components in [src/app/components/ui/](src/app/components/ui/) (e.g., `button.tsx`, `card.tsx`, `dialog.tsx`)
- **Figma Integration**: `figma/ImageWithFallback.tsx` handles Figma design assets

### Data Integration
- **Supabase**: [src/lib/supabase.ts](src/lib/supabase.ts) initializes client with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars
- **Pattern**: Import and use the exported `supabase` singleton for all database operations

### PWA Features
- **Service Worker**: [public/sw.js](public/sw.js) implements network-first caching strategy
- **Manifest**: [public/manifest.json](public/manifest.json) configures app metadata and icons
- **Install Prompt**: [src/app/components/PWAInstallPrompt.tsx](src/app/components/PWAInstallPrompt.tsx) shows custom install UI
- **PWA Styling**: [src/styles/pwa.css](src/styles/pwa.css) handles notch safe areas, touch optimizations, and prevents pull-to-refresh
- See [PWA-FEATURES.md](PWA-FEATURES.md) for complete PWA documentation

## Development Workflow

### Build & Run
```bash
npm install          # Install dependencies (uses pnpm overrides for Vite)
npm run dev          # Start Vite dev server (hot reload enabled)
npm run build        # Production build (output to dist/)
```

### Styling Approach
- **Tailwind CSS v4 with Vite Plugin**: Uses `@tailwindcss/vite` for zero-config styling
- **CSS Modules**: Import global styles from [src/styles/index.css](src/styles/index.css)
- **No PostCSS Config**: Tailwind configured via Vite, not PostCSS
- **Theme Colors**: Defined in `tailwind.css` and `theme.css`
- **Class Utilities**: `class-variance-authority` (CVA) for component variant patterns, `clsx` + `tailwind-merge` for dynamic class composition

### Path Resolution
- **Alias**: `@` resolves to `src/` directory (configured in [vite.config.ts](vite.config.ts))
- Example: `import Button from '@/app/components/ui/button'` instead of relative paths

## Project-Specific Patterns

### Responsive Design
- Mobile-first Tailwind approach (`sm:`, `md:`, `lg:` breakpoints)
- Radix UI components accept responsive props
- Example: [Header.tsx](src/app/components/Header.tsx) uses `hidden md:flex` for desktop nav, separate mobile menu

### Form Handling
- **react-hook-form**: Manage form state and validation
- **Radix UI Form Integration**: Custom form wrappers in [ui/form.tsx](src/app/components/ui/form.tsx)

### UI Component Patterns
- All UI components wrapped as client-side React components
- Radix UI base primitives + Tailwind styling + CVA variants
- Example: [button.tsx](src/app/components/ui/button.tsx) exports unstyled `Button` with variants

### Animation & Interactions
- **Framer Motion Alternative**: `motion` library for animations (not framer-motion)
- **Gestures**: Touch-optimized via `react-dnd`, `react-slick` for carousels
- **Charts**: `recharts` for data visualization

## Critical Integration Points

### Environment Variables
App requires these Vite env vars (prefix `VITE_`):
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

Create `.env.local` in root and configure before running.

### State Management
- **No Global State Library**: Uses React hooks and prop drilling for now
- **If Adding State**: Consider prop-based approach first; scale to Context API or external store if needed

### External Dependencies to Know
- **@radix-ui/***: Headless, unstyled components (12+ packages)
- **@mui/material**: Material UI components (available but secondary to Radix)
- **next-themes**: Dark mode support (imported but integration may be partial)
- **react-router**: Named imports typical (avoid default imports for Route helpers)

## Common Tasks

### Adding a New Page
1. Create component in [src/app/components/](src/app/components/)
2. Add route to [src/app/routes.ts](src/app/routes.ts)
3. Add nav item to [Header.tsx](src/app/components/Header.tsx) navItems array

### Creating a New UI Component
1. Copy structure from existing component in [src/app/components/ui/](src/app/components/ui/)
2. Use Radix UI primitive + Tailwind styling + CVA for variants
3. Export as arrow function component

### Fetching Data from Supabase
```typescript
import { supabase } from '@/lib/supabase'

const { data, error } = await supabase
  .from('table_name')
  .select()
```

## Important Notes

- **Service Worker Caching**: Changes to static assets may require cache invalidation in `/public/sw.js`
- **Manifest Icons**: Update icon URLs and sizes in `manifest.json` when deploying
- **Figma Source**: Original design at https://www.figma.com/design/3Ba9p1q003fAuP0CBng1ny/Flower-Subscription-Website
- **No Tests**: Project currently has no test suite; contributions should maintain code clarity for manual testing
