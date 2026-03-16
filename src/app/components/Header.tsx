import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Logo } from "./Logo";
import { useCart } from "@/app/context/cart";
import { useAuth } from "@/app/context/auth";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { items, removeFromCart, totalPrice, totalItems } = useCart();
  const { user } = useAuth();

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
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>

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

            {/* Auth Button */}
            {!user && (
              <Button onClick={() => navigate('/auth')} size="sm">Login</Button>
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
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block py-3 text-sm ${
                  location.pathname === item.path
                    ? "text-orange-600 font-medium"
                    : "text-gray-600"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!user && (
              <Button
                onClick={() => { navigate('/auth'); setMobileMenuOpen(false); }}
                className="w-full mt-3 bg-orange-600 hover:bg-orange-700 text-white"
                size="sm"
              >
                Login
              </Button>
            )}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Support</p>
              {[
                { label: 'FAQ', href: '#' },
                { label: 'Contact Us', href: '#' },
                { label: 'Delivery Info', href: '#' },
                { label: 'Terms & Conditions', href: '#' },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block py-2.5 text-sm text-gray-600"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}