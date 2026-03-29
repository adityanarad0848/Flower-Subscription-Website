import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/cart';
import { supabase } from '@/lib/supabase';
import { Loader, Plus, MapPin, ShoppingBag, ArrowLeft, Lock, ShieldCheck, Wallet } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { PaymentService } from '@/payumoney-example';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
const paymentService = new PaymentService();

export default function Checkout() {
  const { items, totalPrice, subtotal, deliveryFee, handlingFee, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [specialRequests, setSpecialRequests] = useState('');
  const [formData, setFormData] = useState({ email: '' });
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  const [walletBalance, setWalletBalance] = useState(0);
  const [useWallet, setUseWallet] = useState(false);
  const walletDeduction = useWallet ? Math.min(walletBalance, totalPrice) : 0;
  const finalTotal = Math.max(0, totalPrice - walletDeduction);

  useEffect(() => {
    loadUserData();
    loadAddresses();
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') loadAddresses();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setAddressLoading(true);
    const { data } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    setAddresses(data || []);
    if (data && data.length > 0) {
      const defaultAddr = data.find(a => a.is_default) || data[0];
      setSelectedAddress(defaultAddr);
    }
    setAddressLoading(false);
  };

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setFormData({ email: user.email || '' });
      const { data: walletData } = await supabase
        .from('user_wallets')
        .select('balance')
        .eq('user_id', user.id)
        .maybeSingle();
      setWalletBalance(walletData?.balance || 0);
    }
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
          className="flex items-center gap-2 bg-orange-500 text-white text-sm font-semibold px-6 py-3 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </button>
      </div>
    );
  }

  const initiatePayment = async (orderId: string, orderData: any) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not found');

    const isWeb = !window.Capacitor || window.Capacitor.getPlatform() === 'web';
    if (isWeb) {
      alert('⚠️ Payment Testing Mode\n\nNative PayU SDK only works on Android app.\n\nOrder will be marked as pending.');
      await supabase.from('orders').update({ status: 'pending', payment_method: 'payumoney_web_test' }).eq('id', orderData.id);
      clearCart();
      navigate('/checkout/success');
      return;
    }

    const result = await paymentService.initiatePayment({
      amount: finalTotal.toFixed(2),
      productInfo: `Order #${orderId} - Flower Subscription`,
      firstName: selectedAddress?.name || 'Customer',
      email: user.email || formData.email,
      phone: selectedAddress?.phone || '0000000000',
    });

    if (result.success) {
      await supabase.from('orders').update({ status: 'completed', payment_id: result.transactionId }).eq('id', orderData.id);
      clearCart();
      navigate('/checkout/success');
    } else {
      setError(result.message || 'Payment failed');
      await supabase.from('orders').update({ status: 'failed' }).eq('id', orderData.id);
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { setError('Please select a delivery address'); return; }
    setLoading(true);
    setError('');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('Please login to place an order'); setLoading(false); return; }

      const orderPayload = {
        user_id: user.id,
        customer_name: selectedAddress.name || 'Customer',
        customer_email: user.email || 'no-email@example.com',
        customer_phone: selectedAddress.phone || '0000000000',
        address: selectedAddress.address_line1 + (selectedAddress.address_line2 ? ', ' + selectedAddress.address_line2 : ''),
        city: selectedAddress.city || 'Pune',
        state: selectedAddress.state || 'Maharashtra',
        pincode: selectedAddress.pincode || '000000',
        postal_code: selectedAddress.pincode || '000000',
        items: JSON.stringify(items),
        subtotal: subtotal || 0,
        delivery_fee: deliveryFee || 0,
        handling_fee: handlingFee || 0,
        discount: discount || 0,
        total: finalTotal || 0,
        delivery_date: new Date().toISOString().split('T')[0],
        special_requests: specialRequests || null,
        payment_method: paymentMethod === 'cod' ? 'cod' : 'payumoney',
        status: paymentMethod === 'cod' ? 'confirmed' : 'pending',
        created_at: new Date().toISOString(),
      };

      const { data: orderData, error: insertError } = await supabase.from('orders').insert(orderPayload).select();
      if (insertError) { alert('Order creation failed: ' + insertError.message); throw insertError; }

      // Deduct wallet balance if used
      if (useWallet && walletDeduction > 0) {
        const { data: walletData } = await supabase
          .from('user_wallets')
          .select('id, balance')
          .eq('user_id', user.id)
          .maybeSingle();
        if (walletData) {
          await supabase.from('user_wallets')
            .update({ balance: walletData.balance - walletDeduction })
            .eq('id', walletData.id);
          await supabase.from('wallet_transactions').insert({
            wallet_id: walletData.id,
            amount: walletDeduction,
            type: 'debit',
            description: `Used for order #${orderData[0].id.slice(0, 8)}`,
          });
        }
      }

      const subscriptionItems = items.filter(item => item.subscription);
      if (subscriptionItems.length > 0) {
        const subscriptions = subscriptionItems.map(item => {
          const startDate = item.subscription?.startDate || new Date().toISOString();
          const end = new Date(startDate);
          if (item.subscription?.duration === 'week') end.setDate(end.getDate() + 7);
          else end.setDate(end.getDate() + 30);
          return {
            user_id: user.id,
            product_id: item.productId || null,
            product_name: item.name || 'Product',
            price: item.price || 0,
            duration: item.subscription?.duration || 'month',
            start_date: startDate.split('T')[0],
            end_date: end.toISOString().split('T')[0],
            status: 'active',
            created_at: new Date().toISOString(),
          };
        });
        await supabase.from('user_subscriptions').insert(subscriptions);
      }

      if (paymentMethod === 'cod') {
        clearCart();
        navigate('/checkout/success');
        return;
      }

      await initiatePayment(orderData[0].id, orderData[0]);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/cart')} className="p-1 -ml-1 text-gray-600">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900">Checkout</h1>
          <p className="text-xs text-gray-400">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto lg:max-w-5xl">
        <div className="lg:grid lg:grid-cols-5 lg:gap-6 lg:px-6 lg:py-6">

          {/* Left — main content */}
          <div className="lg:col-span-3 space-y-3 pb-2">

            {error && (
              <div className="mx-4 mt-3 lg:mx-0 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex gap-2">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            {/* Delivery Address */}
            <div className="bg-white lg:rounded-2xl lg:shadow-sm">
              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <h2 className="text-sm font-bold text-gray-900">Delivery Address</h2>
                <button
                  onClick={() => navigate('/address-map?from=checkout')}
                  className="flex items-center gap-1 text-xs font-semibold text-orange-500"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add New
                </button>
              </div>

              <div className="px-4 pb-4 space-y-2">
                {addressLoading ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="p-3 border border-gray-100 rounded-xl animate-pulse">
                      <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))
                ) : addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-3 border-2 rounded-xl cursor-pointer transition-all ${
                        selectedAddress?.id === addr.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-100 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`mt-0.5 ${selectedAddress?.id === addr.id ? 'text-orange-500' : 'text-gray-300'}`}>
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-gray-900">{addr.name}</p>
                            {addr.is_default && (
                              <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium">Default</span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500">{addr.phone}</p>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            {addr.address_line1}{addr.address_line2 && `, ${addr.address_line2}`}, {addr.city} - {addr.pincode}
                          </p>
                        </div>
                        {selectedAddress?.id === addr.id && (
                          <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-xl">
                    <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500 mb-3">No saved addresses</p>
                    <button
                      onClick={() => navigate('/address-map?from=checkout')}
                      className="text-xs font-semibold text-orange-500"
                    >
                      + Add your first address
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white lg:rounded-2xl lg:shadow-sm">
              <div className="px-4 pt-4 pb-2">
                <h2 className="text-sm font-bold text-gray-900">Order Items</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="px-4 py-3 flex items-center gap-3">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-5 h-5 text-orange-300" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 flex-shrink-0">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Requests */}
            <div className="bg-white lg:rounded-2xl lg:shadow-sm px-4 py-4">
              <h2 className="text-sm font-bold text-gray-900 mb-2">Special Requests <span className="text-gray-400 font-normal">(optional)</span></h2>
              <textarea
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="Any delivery instructions..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 h-16 resize-none"
              />
            </div>

            {/* Wallet */}
            {walletBalance > 0 && (
              <div
                onClick={() => setUseWallet(v => !v)}
                className={`mx-0 bg-white lg:rounded-2xl lg:shadow-sm px-4 py-3 cursor-pointer border-2 transition-all ${
                  useWallet ? 'border-green-500 bg-green-50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    useWallet ? 'bg-green-500 border-green-500' : 'border-gray-300'
                  }`}>
                    {useWallet && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                  <Wallet className={`w-4 h-4 flex-shrink-0 ${useWallet ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Use Wallet Balance</p>
                    <p className="text-xs text-gray-400">Available: ₹{walletBalance.toFixed(0)}</p>
                  </div>
                  {useWallet && (
                    <span className="text-sm font-bold text-green-600">−₹{walletDeduction.toFixed(0)}</span>
                  )}
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white lg:rounded-2xl lg:shadow-sm px-4 py-4">
              <h2 className="text-sm font-bold text-gray-900 mb-3">Payment Method</h2>
              <div className="space-y-2">
                <div
                  onClick={() => setPaymentMethod('online')}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'online' ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'online' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Online Payment</p>
                    <p className="text-xs text-gray-400">UPI, Cards, Net Banking via PayU</p>
                  </div>
                  <div className="flex gap-1">
                    <span className="text-lg">💳</span>
                    <span className="text-lg">📱</span>
                  </div>
                </div>

                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-orange-500 bg-orange-50' : 'border-gray-100'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    paymentMethod === 'cod' ? 'border-orange-500' : 'border-gray-300'
                  }`}>
                    {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-400">Pay when your order arrives</p>
                  </div>
                  <span className="text-lg">💵</span>
                </div>
              </div>
            </div>

            {/* Price breakdown — mobile only */}
            <div className="lg:hidden bg-white border-t border-b border-gray-100 px-4 py-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
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
              {useWallet && walletDeduction > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Wallet</span>
                  <span className="font-medium">−₹{walletDeduction.toFixed(0)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-bold text-gray-900">Total</span>
                <span className="text-sm font-bold text-orange-600">₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

          </div>

          {/* Right — desktop order summary */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm sticky top-20">
              <div className="px-5 pt-5 pb-3 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-900">Order Summary</h2>
              </div>
              <div className="px-5 py-4 space-y-2.5">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-3">
                    {item.imageUrl && (
                      <img src={item.imageUrl} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-gray-100 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
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
                {useWallet && walletDeduction > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Wallet</span>
                    <span className="font-medium">−₹{walletDeduction.toFixed(0)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">Total</span>
                  <span className="text-base font-bold text-orange-600">₹{finalTotal.toFixed(0)}</span>
                </div>
              </div>
              <div className="px-5 pb-5">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !selectedAddress}
                  className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? <><Loader className="w-4 h-4 animate-spin" /> Processing...</> : <><Lock className="w-4 h-4" /> {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}</>}
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

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-4 shadow-lg">
        <div>
          <p className="text-[11px] text-gray-400">Total</p>
          <p className="text-base font-bold text-gray-900">₹{finalTotal.toFixed(0)}</p>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={loading || !selectedAddress}
          className="flex-1 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 disabled:opacity-50 text-white text-sm font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <><Loader className="w-4 h-4 animate-spin" /> Processing...</>
          ) : !selectedAddress ? (
            <><MapPin className="w-4 h-4" /> Select Address</>
          ) : (
            <><Lock className="w-4 h-4" /> {paymentMethod === 'cod' ? 'Place Order' : 'Proceed to Payment'}</>
          )}
        </button>
      </div>

      <div className="lg:hidden h-20" />
    </div>
  );
}
