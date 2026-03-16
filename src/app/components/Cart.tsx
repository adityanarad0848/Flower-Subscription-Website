import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/cart';
import { Button } from './ui/button';
import { Trash2, ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { Card, CardContent } from './ui/card';

export default function Cart() {
  const { items, removeFromCart, updateQuantity, subtotal, tax, discount, totalPrice } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

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
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-orange-500" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold px-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-2">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-200">
                {items.map((item, index) => (
                  <div
                    key={item.productId}
                    className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      {item.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                          />
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1">{item.name}</h3>
                            {item.category && (
                              <p className="text-sm text-gray-500">{item.category}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.productId)}
                            className="text-gray-400 hover:text-red-600 transition-colors ml-4"
                            title="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        {item.subscription && (
                          <div className="mb-3">
                            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-800 text-xs font-medium px-3 py-1.5 rounded-full">
                              <span>📅 {item.subscription.duration === 'week' ? '1 Week Trial' : '1 Month Subscription'}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(item.subscription.startDate).toLocaleDateString()} - {new Date(item.subscription.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Selector */}
                          <div className="flex items-center gap-1 border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="text-lg md:text-xl font-bold text-orange-600">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                              <p className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                {tax > 0 && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax (5%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount (10%)</span>
                    <span className="font-semibold">-₹{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-6 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <span>🔒</span>
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
