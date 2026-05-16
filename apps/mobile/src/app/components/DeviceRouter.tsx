import { Capacitor } from '@capacitor/core';
import { Home } from './Home';
import DesktopLanding from './DesktopLanding';
import { useEffect, useState } from 'react';

export default function DeviceRouter() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if it's a native platform or mobile browser
    const checkDevice = () => {
      const isNative = Capacitor.isNativePlatform();
      const isMobileBrowser = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768;
      
      setIsMobile(isNative || (isMobileBrowser && isSmallScreen));
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  return isMobile ? <Home /> : <DesktopLanding />;
}
