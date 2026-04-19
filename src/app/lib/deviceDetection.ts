export function isMobileDevice(): boolean {
  // Check if running in Capacitor (native app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return true;
  }

  // Check user agent for mobile devices
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Mobile device patterns (excluding iPad which reports as desktop)
    const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
    
    // Check if mobile phone
    if (mobileRegex.test(userAgent.toLowerCase())) {
      return true;
    }

    // Check screen size - only consider truly mobile sizes
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return true;
    }
  }

  return false;
}

export function isDesktopDevice(): boolean {
  return !isMobileDevice();
}
