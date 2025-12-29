# FlowerExpressCo Mobile Build Quickstart

Quick reference for building and publishing the FlowerExpressCo mobile app on Android and iOS.

> **Detailed guides**: See `PLAY_STORE_GUIDE.md` (Android) and `APP_STORE_GUIDE.md` (iOS) for comprehensive instructions.

---

## Prerequisites

| Requirement | Android | iOS |
|-------------|---------|-----|
| **OS** | Windows, macOS, or Linux | macOS only |
| **IDE** | Android Studio | Xcode 15+ |
| **Account** | Google Play Console ($25 one-time) | Apple Developer Program ($99/year) |
| **Node.js** | v18+ | v18+ |
| **Device** | Android 7.0+ or Emulator | iPhone/iPad or Simulator |

---

## 1. Initial Setup (One-Time)

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/flowerexpressco.git
cd flowerexpressco

# Install dependencies
npm install

# Add native platforms
npx cap add android
npx cap add ios
```

---

## 2. Development Workflow

### Build & Sync

```bash
# Build the web app
npm run build

# Sync to native platforms
npx cap sync
```

### Run on Device/Emulator

```bash
# Android
npx cap run android

# iOS (Mac only)
npx cap run ios
```

### Live Reload (Development)

The `capacitor.config.ts` is pre-configured for live reload:
```typescript
server: {
  url: "https://ce940b1d-3075-43ef-b4c3-9bce0537c076.lovableproject.com?forceHideBadge=true",
  cleartext: true
}
```

> **Important**: Remove the `server` config before building for production!

---

## 3. Android Build & Publish

### Generate Signed APK/AAB

```bash
# Open in Android Studio
npx cap open android
```

1. **Build** → **Generate Signed Bundle / APK**
2. Create keystore (first time) or use existing
3. Select **Android App Bundle** for Play Store
4. Choose **release** build variant
5. Output: `android/app/release/app-release.aab`

### Play Store Checklist

- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG) - in `public/screenshots/`
- [ ] Screenshots (min 2) - in `public/screenshots/`
- [ ] Privacy policy URL
- [ ] Content rating questionnaire completed
- [ ] Target API level 34+

### Upload to Play Console

1. Go to [play.google.com/console](https://play.google.com/console)
2. **Create app** → Fill store listing
3. **Production** → **Create new release**
4. Upload `.aab` file
5. Complete all sections in the left sidebar
6. **Submit for review**

---

## 4. iOS Build & Publish

### Open in Xcode

```bash
npx cap open ios
```

### Configure Signing

1. Select **App** target → **Signing & Capabilities**
2. Enable **Automatically manage signing**
3. Select your **Team** (Apple Developer account)
4. Set **Bundle Identifier**: `com.flowerexpress.app`

### Create Archive

1. Select **Any iOS Device** as build target
2. **Product** → **Archive**
3. Wait for build to complete
4. **Distribute App** → **App Store Connect**

### App Store Connect Checklist

- [ ] App icon (1024x1024 PNG, no alpha)
- [ ] Screenshots for each device size
- [ ] App description & keywords
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App Review Information

### Submit for Review

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Select your app → **App Store** tab
3. Fill all required metadata
4. **Add for Review** → **Submit**

---

## 5. Production Build Checklist

Before submitting to stores:

```typescript
// capacitor.config.ts - REMOVE server config for production!
const config: CapacitorConfig = {
  appId: 'com.flowerexpress.app',
  appName: 'FlowerExpressCo',
  webDir: 'dist',
  // Remove these lines for production:
  // server: {
  //   url: "...",
  //   cleartext: true
  // }
};
```

- [ ] Remove `server` config from `capacitor.config.ts`
- [ ] Run `npm run build`
- [ ] Run `npx cap sync`
- [ ] Test on real device
- [ ] Verify all features work offline
- [ ] Check app icon displays correctly
- [ ] Test deep links (if applicable)

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Build web app | `npm run build` |
| Sync to native | `npx cap sync` |
| Run Android | `npx cap run android` |
| Run iOS | `npx cap run ios` |
| Open Android Studio | `npx cap open android` |
| Open Xcode | `npx cap open ios` |
| Update Capacitor | `npx cap update` |

---

## Troubleshooting

### Android: "SDK not found"
```bash
# Set ANDROID_HOME
export ANDROID_HOME=$HOME/Android/Sdk  # Linux/Mac
# Or set in Android Studio: Tools → SDK Manager
```

### iOS: "No signing certificate"
1. Xcode → Preferences → Accounts
2. Add Apple ID
3. Manage Certificates → Create iOS Distribution

### Build fails after changes
```bash
# Clean and rebuild
rm -rf dist
npm run build
npx cap sync
```

### App shows old content
```bash
# Force clean sync
npx cap sync --force
```

---

## Timeline Estimates

| Phase | Android | iOS |
|-------|---------|-----|
| Setup & First Build | 1-2 hours | 2-3 hours |
| Store Listing | 2-3 hours | 2-3 hours |
| Review Process | 1-3 days | 1-7 days |
| First Publish | 3-5 days | 5-10 days |

---

## Support Resources

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Android Developers](https://developer.android.com)
- [Apple Developer](https://developer.apple.com)
- [Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect)
