import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { PWAInstallPrompt } from "./PWAInstallPrompt";
import { CartProvider } from '@/app/context/cart';

export default function Root() {
  return (
    <CartProvider>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <PWAInstallPrompt />
    </CartProvider>
  );
}