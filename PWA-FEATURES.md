# BloomBox PWA Features

This application is optimized as a Progressive Web App (PWA) for the best mobile and desktop experience.

## PWA Optimizations Implemented

### 1. Web App Manifest (`/public/manifest.json`)
- App name, description, and branding
- Theme color: `#db2777` (Pink)
- Display mode: `standalone` for native-app-like experience
- Icons for different screen sizes
- Portrait orientation lock

### 2. Service Worker (`/public/sw.js`)
- Offline functionality
- Network-first caching strategy
- Automatic cache updates
- Fallback content when offline

### 3. Mobile-First Responsive Design
- Fully responsive layouts optimized for mobile devices
- Touch-friendly button sizes (minimum 44x44px)
- Optimized images with proper aspect ratios
- Mobile navigation with hamburger menu

### 4. PWA-Specific Styling (`/src/styles/pwa.css`)
- Safe area insets for notched devices (iPhone X+)
- Prevents unwanted zoom on input focus
- Smooth scrolling
- Optimized touch interactions
- Disabled pull-to-refresh to prevent conflicts

### 5. Install Prompt
- Custom install prompt component
- Appears when PWA installation is available
- Can be dismissed by user
- Service worker registration

## Features

### Installable
Users can install the app on their device from:
- Chrome/Edge: Click the install icon in the address bar
- Safari (iOS): Share button → Add to Home Screen
- Custom prompt when browsing the site

### Offline Support
- Key pages cached for offline viewing
- Network-first strategy ensures fresh content when online
- Graceful fallback when content is unavailable

### App-Like Experience
- Runs in standalone mode (no browser UI)
- Fast loading with optimized assets
- Smooth animations and transitions
- Native-like navigation

### Mobile Optimizations
- Responsive breakpoints for all screen sizes
- Touch-optimized UI elements
- Gesture-friendly interactions
- Optimized images with lazy loading

## Testing PWA Features

### Local Testing
1. Build the app: `npm run build`
2. Serve the build: `npx serve -s dist`
3. Open in Chrome/Edge at `localhost:3000`
4. Open DevTools → Application → Manifest/Service Workers

### Lighthouse Audit
Run a Lighthouse audit in Chrome DevTools:
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select "Progressive Web App"
4. Click "Generate report"

### Install Testing
- Desktop: Look for install icon in address bar
- Mobile: Should see "Add to Home Screen" prompt
- Custom prompt: Should appear at bottom of screen

## Browser Support
- Chrome/Edge: Full support
- Safari: Install via "Add to Home Screen"
- Firefox: Partial support (no install prompt)
- Samsung Internet: Full support

## Future Enhancements
- Push notifications for delivery updates
- Background sync for order submissions
- Share API integration
- Payment Request API
- Geolocation for delivery tracking

## Deployment Notes
When deploying to production:
1. Update manifest.json with production URLs
2. Add real icon files (192x192, 512x512)
3. Configure HTTPS (required for PWA)
4. Test on actual devices
5. Submit to app stores (optional)
