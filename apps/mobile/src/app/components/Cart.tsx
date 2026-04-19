import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/cart';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus, ShieldCheck, Tag } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, deliveryFee, handlingFee, discount, totalPrice } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleCheckout = () => {
    if (!user) {
      sessionStorage.setItem('returnTo', '/checkout');
      navigate('/auth');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-9 h-9 text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h2>
        <p className="text-sm text-gray-500 mb-6">Add items to get started</p>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1 -ml-1 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">My Cart</h1>
          <p className="text-xs text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto lg:max-w-5xl">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6 lg:px-6 lg:py-6">

          {/* Cart Items */}
          <div className="lg:col-span-3">
            <div className="bg-white divide-y divide-gray-100 lg:rounded-2xl lg:overflow-hidden lg:shadow-sm">
              {items.map((item) => (
                <div key={item.productId} className="px-3 py-3 flex gap-3">
                  {/* Image */}
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-orange-300" />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{item.name}</p>
                        {item.category && (
                          <p className="text-xs text-gray-400 mt-0.5">{item.category}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="p-1 text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.subscription && (
                      <span className="inline-flex items-center gap-1 mt-1.5 bg-orange-50 text-orange-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        📅 {item.subscription.duration === 'week' ? '1 Week Trial' : '1 Month'}
                      </span>
                    )}

                    <div className="flex items-center justify-between mt-2.5">
                      {/* Qty stepper */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center text-xs font-bold text-gray-900 border-x border-gray-200">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">₹{((item.price || 0) * item.quantity).toFixed(0)}</p>
                        {item.quantity > 1 && (
                          <p className="text-[10px] text-gray-400">₹{(item.price || 0).toFixed(0)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings banner */}
            {discount > 0 && (
              <div className="mx-4 mt-3 lg:mx-0 flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                <Tag className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-xs font-medium text-green-700">
                  You're saving <span className="font-bold">₹{discount.toFixed(0)}</span> on this order!
                </p>
              </div>
            )}
          </div>

          {/* Order Summary — mobile */}
          <div className="lg:hidden bg-white mt-3 border-t border-b border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal ({items.length} items)</span>
                <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Delivery fee</span>
                <span className="font-medium text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Handling fee</span>
                <span className="font-medium text-gray-900">₹{handlingFee.toFixed(0)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount (5%)</span>
                  <span className="font-medium">−₹{discount.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-sm font-bold text-orange-600">₹{totalPrice.toFixed(0)}</span>
              </div>
            </div>
          </div>

          {/* Order Summary — desktop only */}
          <div className="hidden lg:block lg:col-span-2 mt-4 lg:mt-0">
            <div className="bg-white lg:rounded-2xl lg:shadow-sm">
              <div className="px-4 py-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Order Summary</h2>
              </div>

              <div className="px-4 py-3 space-y-2.5">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Handling fee</span>
                  <span className="font-medium text-gray-900">₹{handlingFee.toFixed(0)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount (5%)</span>
                    <span className="font-medium">−₹{discount.toFixed(0)}</span>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-lg font-bold text-orange-600">₹{totalPrice.toFixed(0)}</span>
              </div>

              <div className="px-4 pb-4">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold py-3.5 rounded-xl transition-colors shadow-sm"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </button>

                <div className="flex items-center justify-center gap-1.5 mt-3">
                  <ShieldCheck className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-[11px] text-gray-400">Secure & encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sticky checkout bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-4 shadow-lg">
        <div>
          <p className="text-[11px] text-gray-400">Total amount</p>
          <p className="text-base font-bold text-gray-900">₹{totalPrice.toFixed(0)}</p>
        </div>
        <button
          onClick={handleCheckout}
          className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-bold py-3 rounded-xl transition-colors"
        >
          {user ? 'Proceed to Checkout' : 'Login to Checkout'}
        </button>
      </div>

      {/* Bottom padding for mobile sticky bar */}
      <div className="lg:hidden h-20" />
    </div>
  );
}
