export function isMobileDevice(): boolean {
  // Check if running in Capacitor (native app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    return true;
  }

  // Check user agent for mobile devices
  if (typeof navigator !== 'undefined') {
    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    
    // Mobile device patterns
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile/i;
    
    // Check if mobile
    if (mobileRegex.test(userAgent.toLowerCase())) {
      return true;
    }

    // Check for tablet
    const isTablet = /(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent.toLowerCase());
    if (isTablet) {
      return true;
    }

    // Check screen size as fallback
    if (window.innerWidth <= 768) {
      return true;
    }
  }

  return false;
}

export function isDesktopDevice(): boolean {
  return !isMobileDevice();
}
