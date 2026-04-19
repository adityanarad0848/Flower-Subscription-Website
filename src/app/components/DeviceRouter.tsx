import { isDesktopDevice } from '@/app/lib/deviceDetection';
import DesktopLanding from './DesktopLanding';
import { Home } from './Home';

export default function DeviceRouter() {
  if (isDesktopDevice()) {
    return <DesktopLanding />;
  }
  return <Home />;
}
