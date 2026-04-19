import { Outlet } from "react-router-dom";
import { CartProvider } from '@/app/context/cart';

export default function RootWithoutHeader() {
  return (
    <CartProvider>
      <Outlet />
    </CartProvider>
  );
}
