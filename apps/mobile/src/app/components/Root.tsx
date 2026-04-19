import { Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { SplashScreen } from "./SplashScreen";
import { CartProvider } from '@/app/context/cart';
import { useAuth } from '@/app/context/auth';

export default function Root() {
  const location = useLocation();
  const { loading: authLoading } = useAuth();

  const shouldSkipSplash = () =>
    location.pathname === '/auth/callback' ||
    !!sessionStorage.getItem('splash_shown') ||
    !!localStorage.getItem('splash_shown');

  const [showSplash, setShowSplash] = useState(() => !shouldSkipSplash());
  const [appReady, setAppReady] = useState(() => shouldSkipSplash());

  // Wait for auth to load and minimum splash time
  useEffect(() => {
    if (shouldSkipSplash()) return;

    const minSplashTime = 2500;
    const startTime = Date.now();

    if (!authLoading) {
      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minSplashTime - elapsed);
      setTimeout(() => {
        setAppReady(true);
        sessionStorage.setItem('splash_shown', '1');
        localStorage.setItem('splash_shown', '1');
      }, remainingTime);
    }
  }, [authLoading]);

  if (showSplash && !appReady) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
      <PWAInstallPrompt />
    </CartProvider>
  );
}
