import { Link, useLocation, useNavigate } from "react-router";
import { Menu, ShoppingCart, MapPin, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { useCart } from "@/app/context/cart";
import { useAuth } from "@/app/context/auth";
import { supabase } from "../../lib/supabase";

export function Header() {
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState<{ id: string; name: string; house_no: string | null; building: string | null; address_line1: string; pincode: string | null } | null>(null);

  const loadAddresses = () => {
    if (!user) { setDefaultAddress(null); return; }
    supabase
      .from('user_addresses')
      .select('id, name, house_no, building, address_line1, pincode, is_default')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error('Address fetch error:', error);
        setDefaultAddress(data?.find((a: any) => a.is_default) ?? data?.[0] ?? null);
      });
  };

  useEffect(() => { loadAddresses(); }, [user]);

  // Reload address when returning from select-location page
  useEffect(() => { loadAddresses(); }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cartRef.current && !cartRef.current.contains(event.target as Node)) {
        setCartDropdownOpen(false);
      }
    };

    if (cartDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [cartDropdownOpen]);

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/how-it-works", label: "How It Works" },
    { path: "/account", label: "Account" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Delivery Address - mobile only */}
          <button
            onClick={() => navigate('/select-location')}
            className="md:hidden flex items-center gap-1.5 min-w-0"
          >
            <MapPin className="w-4 h-4 text-orange-500 shrink-0" />
            <div className="text-left min-w-0">
              <p className="text-[10px] text-gray-400 leading-none">Deliver to</p>
              <p className="text-sm font-semibold text-gray-900 truncate max-w-[180px]">
                {defaultAddress ? (() => {
                  // Build clean display: "Home · House 12, Sunrise Apt" or area from address_line1
                  const parts: string[] = [];
                  if (defaultAddress.house_no) parts.push(defaultAddress.house_no);
                  if (defaultAddress.building) parts.push(defaultAddress.building);
                  if (parts.length === 0) {
                    // Fall back to first meaningful part of address_line1 (strip coords)
                    const raw = defaultAddress.address_line1 ?? '';
                    const isCoords = /^-?\d+\.\d+,\s*-?\d+\.\d+$/.test(raw.trim());
                    parts.push(isCoords ? 'Pune' : raw.split(',')[0]);
                  }
                  return `${defaultAddress.name} · ${parts.join(', ')}`;
                })() : 'Add address'}
              </p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          </button>

          {/* Desktop Navigation & Cart */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm transition-colors h-16 flex items-center ${
                  location.pathname === item.path
                    ? "text-orange-600 font-medium"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Auth Button / User Circle - BESIDE CART */}
            {user ? (
              <button
                onClick={() => navigate('/account')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold text-lg flex items-center justify-center hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Account"
                title={user.email ?? 'My Account'}
              >
                {(user.user_metadata?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold flex items-center justify-center hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Login"
                title="Login"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Cart Button - Desktop */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setCartDropdownOpen(!cartDropdownOpen)}
                className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>

              {/* Dropdown Menu */}
              {cartDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-4 text-lg">Cart ({totalItems})</h3>

                    {items.length === 0 ? (
                      <p className="text-gray-500 py-4">Your cart is empty</p>
                    ) : (
                      <>
                        <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                          {items.slice(0, 3).map((item) => (
                            <div key={item.productId} className="flex gap-3 pb-2 border-b">
                              {item.imageUrl && (
                                <img
                                  src={item.imageUrl}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm truncate text-gray-900">{item.name}</p>
                                <p className="text-sm text-gray-600">
                                  {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="text-red-600 hover:text-red-700 text-sm font-semibold"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>

                        {items.length > 3 && (
                          <p className="text-xs text-gray-500 mb-2">+{items.length - 3} more items</p>
                        )}

                        <div className="border-t pt-3 mb-4">
                          <div className="flex justify-between font-bold text-gray-900">
                            <span>Total:</span>
                            <span className="text-orange-600">₹{totalPrice.toFixed(2)}</span>
                          </div>
                        </div>

                        <Button
                          onClick={() => navigate('/cart')}
                          className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold"
                        >
                          View Cart
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button & Cart */}
          <div className="md:hidden flex items-center gap-2">
            {/* User Circle - Mobile - BESIDE CART */}
            {user ? (
              <button
                onClick={() => navigate('/account')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold text-sm flex items-center justify-center hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg"
                aria-label="Account"
              >
                {(user.user_metadata?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </button>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold flex items-center justify-center hover:from-orange-600 hover:to-pink-700 transition-all shadow-lg"
                aria-label="Login"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            <button
              className="md:hidden p-2"
              onClick={() => navigate('/menu')}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </nav>

    </header>
  );
}