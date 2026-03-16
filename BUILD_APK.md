# Building Android APK

## Prerequisites
- Install [Android Studio](https://developer.android.com/studio)
- Install Java JDK 17 or higher

## Build Steps

### 1. Build the web app and sync with Android
```bash
npm run android:sync
```

### 2. Build APK (Debug)
```bash
npm run android:build
```

The APK will be located at:
`android/app/build/outputs/apk/debug/app-debug.apk`

### 3. Build APK using Android Studio (Alternative)
```bash
npm run android:open
```
Then in Android Studio: Build → Build Bundle(s) / APK(s) → Build APK(s)

## Install APK on Device
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Build Release APK (for production)
1. Generate signing key
2. Configure signing in `android/app/build.gradle`
3. Run: `cd android && ./gradlew assembleRelease`
