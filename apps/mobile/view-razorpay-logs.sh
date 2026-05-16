#!/bin/bash

# Razorpay Debug Log Viewer
# This script helps you view Razorpay payment logs in real-time

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Razorpay Payment Debug Log Viewer                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if adb is available
if ! command -v adb &> /dev/null; then
    echo "❌ ERROR: adb not found!"
    echo "Please install Android SDK Platform Tools"
    exit 1
fi

# Check if device is connected
DEVICE_COUNT=$(adb devices | grep -v "List" | grep "device" | wc -l)
if [ "$DEVICE_COUNT" -eq 0 ]; then
    echo "❌ ERROR: No Android device connected!"
    echo "Please connect your device or start an emulator"
    exit 1
fi

echo "✅ Device connected"
echo ""
echo "📱 Connected devices:"
adb devices
echo ""
echo "🔍 Starting log monitoring..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Clear previous logs
adb logcat -c

# Start monitoring logs with color support
adb logcat | grep --line-buffered -E "Razorpay|MainActivity|Checkout" | while read line; do
    # Color coding based on log level
    if echo "$line" | grep -q "ERROR\|❌\|💥"; then
        echo -e "\033[0;31m$line\033[0m"  # Red for errors
    elif echo "$line" | grep -q "SUCCESS\|✅\|✓"; then
        echo -e "\033[0;32m$line\033[0m"  # Green for success
    elif echo "$line" | grep -q "WARNING\|⚠️"; then
        echo -e "\033[0;33m$line\033[0m"  # Yellow for warnings
    elif echo "$line" | grep -q "🚀\|📦\|📥\|📤"; then
        echo -e "\033[0;36m$line\033[0m"  # Cyan for important events
    else
        echo "$line"
    fi
done
