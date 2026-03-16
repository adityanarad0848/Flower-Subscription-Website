#!/bin/bash

echo "Installing Java JDK 17..."
echo "This script requires your password for sudo commands."
echo ""

# Fix Homebrew permissions
echo "Step 1: Fixing Homebrew permissions..."
sudo chown -R adityanarad /usr/local/Homebrew

# Install OpenJDK 17
echo "Step 2: Installing OpenJDK 17..."
brew install openjdk@17

# Link Java
echo "Step 3: Linking Java..."
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Set JAVA_HOME
echo "Step 4: Setting JAVA_HOME..."
export JAVA_HOME=/Library/Java/JavaVirtualMachines/openjdk-17.jdk/Contents/Home

# Build APK
echo "Step 5: Building APK..."
cd "$(dirname "$0")"
npm run android:build

echo ""
echo "✅ Build complete!"
echo "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
