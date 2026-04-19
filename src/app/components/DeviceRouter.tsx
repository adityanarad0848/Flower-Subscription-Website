import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import DesktopLanding from './DesktopLanding';
import { Home } from './Home';

export default function DeviceRouter() {
  const [isNativeApp, setIsNativeApp] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if running in native Capacitor app
    setIsNativeApp(Capacitor.isNativePlatform());
  }, []);

  // Show nothing while detecting
  if (isNativeApp === null) {
    return <div className="min-h-screen bg-white" />;
  }

  // If native app (Android APK), show mobile PWA
  if (isNativeApp) {
    return <Home />;
  }
  
  // Otherwise (web browser), always show desktop landing page
  return <DesktopLanding />;
}
