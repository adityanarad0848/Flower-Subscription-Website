import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import { Subscriptions } from "./components/Subscriptions";
import Products from "./components/Products";
import { HowItWorks } from "./components/HowItWorks";
import { AddressManager } from "./components/AddressManager";
import Root from "./components/Root";
import Cart from '@/app/components/Cart';
import Checkout from '@/app/components/Checkout';
import CheckoutSuccess from '@/app/components/CheckoutSuccess';
import Auth from '@/app/components/Auth';
import Account from '@/app/components/Account';
import PlanSelection from '@/app/components/PlanSelection';
import GoogleCallback from '@/app/components/GoogleCallback';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      // { path: "products", Component: Products },
      { path: "how-it-works", Component: HowItWorks },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "checkout/success", Component: CheckoutSuccess },
      { path: "auth", Component: Auth },
      { path: "auth/callback", Component: GoogleCallback },
      { path: "account", Component: Account },
      { path: "addresses", Component: AddressManager },
      { path: "plans", Component: PlanSelection },
    ],
  },
]);
