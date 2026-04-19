import DesktopLanding from './DesktopLanding';

export default function DeviceRouter() {
  // Always show desktop landing page for web
  // Mobile PWA will only show in the Android APK
  return <DesktopLanding />;
}
