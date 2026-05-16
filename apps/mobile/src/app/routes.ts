import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";
import Products from "./components/Products";
import { HowItWorks } from "./components/HowItWorks";
import { AddressManager } from "./components/AddressManager";
import Root from "./components/Root";
import RootWithoutHeader from "./components/RootWithoutHeader";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Cart from '@/app/components/Cart';
import Checkout from '@/app/components/Checkout';
import CheckoutSuccess from '@/app/components/CheckoutSuccess';
import Auth from '@/app/components/Auth';
import PhoneAuth from '@/app/components/PhoneAuth';
import AddPhone from '@/app/components/AddPhone';
import Profile from '@/app/components/Profile';
import Account from '@/app/components/Account';
import GoogleCallback from '@/app/components/GoogleCallback';
import SelectLocation from '@/app/components/SelectLocation';
import AddressMap from '@/app/components/AddressMap';
import PauseDelivery from '@/app/components/PauseDelivery';
import ActiveSubscriptions from '@/app/components/ActiveSubscriptions';
import { AdminBanners } from '@/app/components/AdminBanners';
import { FAQ } from '@/app/components/FAQ';
import { ContactUs } from '@/app/components/ContactUs';
import { LiveSupport } from '@/app/components/LiveSupport';
import { DeliveryInfo } from '@/app/components/DeliveryInfo';
import { TermsAndConditions } from '@/app/components/TermsAndConditions';
import { Menu } from '@/app/components/Menu';
import DesktopLanding from '@/app/components/DesktopLanding';
import DeviceRouter from '@/app/components/DeviceRouter';
import PujanLanding from '@/app/components/PujanLanding';
import FlowerDeliveryLanding from '@/app/components/FlowerDeliveryLanding';

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "how-it-works", Component: HowItWorks },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "checkout/success", Component: CheckoutSuccess },
      { path: "auth", Component: Auth },
      { path: "auth/phone", Component: PhoneAuth },
      { path: "auth/add-phone", Component: AddPhone },
      { path: "auth/callback", Component: GoogleCallback },
      { path: "profile", Component: Profile },
      { path: "account", Component: Account },
      { path: "addresses", Component: AddressManager },
      { path: "select-location", Component: SelectLocation },
      { path: "address-map", Component: AddressMap },
      { path: "pause-delivery", Component: PauseDelivery },
      { path: "active-subscriptions", Component: ActiveSubscriptions },
      { path: "admin/banners", Component: AdminBanners },
      { path: "faq", Component: FAQ },
      { path: "contact", Component: ContactUs },
      { path: "support", Component: LiveSupport },
      { path: "delivery-info", Component: DeliveryInfo },
      { path: "terms", Component: TermsAndConditions },
      { path: "menu", Component: Menu },
      { path: "flowers", Component: FlowerDeliveryLanding },
      { path: "pujan", Component: PujanLanding },
    ],
  },
]);
