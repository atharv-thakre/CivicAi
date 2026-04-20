# PWA Setup Guide

Your CivicAlert project has been successfully configured as a Progressive Web App (PWA)! 🎉

## What's Been Configured

### ✅ Core PWA Setup

- **Service Worker**: Automatic caching with Workbox
- **Manifest File**: `public/manifest.json` with app metadata
- **Offline Support**: Smart caching strategy for static assets and API calls
- **Installation**: Users can install CivicAlert as a native app

### ✅ Features Enabled

- 📱 Add to Home Screen (all platforms)
- 🔄 Offline functionality with cache-first strategy
- 🔌 Network-first approach for API calls
- 💾 Runtime cache with 1-hour expiration
- 🎨 Custom theme colors and launch icons

## App Icons Required

You need to create and place the following icons in the `public/` directory:

```
public/
├── icon-192x192.png           (192×192 PNG - home screen icon)
├── icon-192x192-maskable.png  (192×192 PNG - maskable variant)
├── icon-384x384.png           (384×384 PNG - larger devices)
├── icon-384x384-maskable.png  (384×384 PNG - maskable variant)
├── icon-512x512.png           (512×512 PNG - splash screen)
├── icon-512x512-maskable.png  (512×512 PNG - maskable variant)
├── screenshot-1.png           (1280×720 - wide screenshot for app store)
└── screenshot-mobile-1.png    (540×720 - mobile screenshot)
```

### Icon Generation Tools

1. **Online Tools** (fastest):
   - [PWA Builder](https://www.pwabuilder.com/) - Upload a single image, generates all sizes
   - [easyicon.net](https://www.easyicon.net/)
   - [Icon Converter](https://icoconvert.com/)

2. **Using ImageMagick** (if installed):

   ```bash
   convert logo.png -resize 192x192 public/icon-192x192.png
   convert logo.png -resize 384x384 public/icon-384x384.png
   convert logo.png -resize 512x512 public/icon-512x512.png
   ```

3. **Using Node.js Tools**:
   ```bash
   npm install -g sharp-cli
   sharp input.png -o public/icon-192x192.png -w 192 -h 192
   ```

### Maskable Icons

Maskable icons are special icons that work on different device shapes. They should:

- Have at least 45px of padding from edges
- Support rounded, circle, and teardrop masks
- Use high contrast with the theme color (#1f2937)

## Build & Test

### Development

```bash
npm run dev
```

The PWA will be available with service worker in development mode.

### Production Build

```bash
npm run build
```

This creates an optimized build with:

- Minified assets
- Service worker injection
- Manifest file inclusion
- Asset versioning

### Test PWA Features

1. **Desktop**: Open DevTools → Application → Service Workers
2. **Mobile**: Open in Chrome → Menu → Install app
3. **Offline Testing**:
   - DevTools → Application → Service Workers → Offline checkbox
   - Navigate around - cached pages should load
4. **Check Manifest**: DevTools → Application → Manifest

## Configuration Details

### `vite.config.js`

- **Strategy**: `injectManifest` - Uses Workbox for comprehensive caching
- **Manifest**: Auto-generated with app metadata
- **Workbox Configuration**:
  - Caches all static assets (.js, .css, .html, images)
  - Network-first strategy for external API calls
  - 32 max cache entries, 1-hour expiration for runtime cache

### `public/manifest.json`

Defines app appearance and behavior:

- App name, description, theme colors
- Start URL and scope
- Display mode (standalone - full screen)
- Available shortcuts for quick actions
- Categories and descriptions

### `index.html` Updates

- Meta tags for iOS and Android compatibility
- Theme color declaration
- Manifest link
- Service worker registration script

## Customization

### Change App Name

Edit `public/manifest.json`:

```json
{
  "name": "Your App Name",
  "short_name": "Short Name"
}
```

### Change Theme Colors

Update in `vite.config.js` and `public/manifest.json`:

- `theme_color`: Color of browser UI
- `background_color`: Splash screen background

### Modify Caching Strategy

In `vite.config.js` → `workbox` section:

- Change `runtimeCaching` settings
- Adjust `globPatterns` for different file types
- Modify expiration times

## Deployment Checklist

- [ ] Replace placeholder icons with actual brand icons
- [ ] Update app name and description in `manifest.json`
- [ ] Verify theme colors match brand
- [ ] Test on real devices (iOS and Android)
- [ ] Test offline functionality
- [ ] Check installation works on home screen
- [ ] Verify shortcuts work properly
- [ ] Test on different screen sizes

## Browser Support

✅ **Fully Supported**:

- Chrome/Chromium 84+
- Edge 84+
- Samsung Internet 14+
- Opera 70+

✅ **Partial Support**:

- Firefox (Service Workers only, no install)
- Safari iOS 16.4+ (Service Workers, limited install)

## Troubleshooting

### Service Worker Not Registering?

- Check browser console for errors
- Ensure HTTPS on production (required for SW)
- HTTP only works in localhost dev

### Icons Not Showing?

- Verify file paths in `manifest.json`
- Check file sizes and formats (PNG recommended)
- Clear browser cache and rebuild

### App Won't Install?

- Need valid manifest.json
- Need valid service worker
- Minimum 192×192 icon required
- HTTPS required in production

## Next Steps

1. **Generate Icons**: Use PWA Builder or similar tool
2. **Place Icons**: Save to `public/` directory
3. **Test Build**: `npm run build` then `npm run preview`
4. **Test Installation**: Try installing on Android device
5. **Deploy**: Push to production HTTPS server

For more info: [web.dev/progressive-web-apps/](https://web.dev/progressive-web-apps/)
