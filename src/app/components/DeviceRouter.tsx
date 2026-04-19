import { useState, useEffect } from 'react';
import { isDesktopDevice } from '@/app/lib/deviceDetection';
import DesktopLanding from './DesktopLanding';
import { Home } from './Home';

export default function DeviceRouter() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    // Run device detection only on client side
    setIsDesktop(isDesktopDevice());
  }, []);

  // Show nothing while detecting (prevents flash)
  if (isDesktop === null) {
    return <div className="min-h-screen bg-white" />;
  }

  if (isDesktop) {
    return <DesktopLanding />;
  }
  return <Home />;
}
