import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/app/context/cart';
import { supabase } from '@/lib/supabase';
import { Button } from './ui/button';
import { Loader, Plus, MapPin, ShoppingBag, ArrowLeft, Lock, CreditCard } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import emailjs from '@emailjs/browser';

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export default function Checkout() {
  const { items, totalPrice, subtotal, tax, discount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    specialRequests: '',
    paymentMethod: 'card',
  });

  useEffect(() => {
    loadUserData();
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    
    setAddresses(data || []);
    if (data && data.length > 0) {
      const defaultAddr = data.find(a => a.is_default) || data[0];
      setSelectedAddress(defaultAddr);
      setFormData(prev => ({
        ...prev,
        address: defaultAddr.address_line1 + (defaultAddr.address_line2 ? ', ' + defaultAddr.address_line2 : ''),
        city: defaultAddr.city,
        postalCode: defaultAddr.pincode,
        phone: defaultAddr.phone,
        fullName: defaultAddr.name,
      }));
    }
  };

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      console.log('User profile:', profile);
      console.log('User metadata:', user.user_metadata);
      
      if (profile) {
        setFormData(prev => ({
          ...prev,
          fullName: profile.full_name || user.user_metadata?.full_name || '',
          email: user.email || '',
          phone: profile.phone || '',
          address: profile.address || ''
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          fullName: user.user_metadata?.full_name || '',
          email: user.email || ''
        }));
      }
      
      console.log('Form data set to:', formData);
    }
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
          <p className="text-gray-600 mb-8">Add items to your cart before checking out.</p>
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.address) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Insert order into Supabase
      const { error: insertError } = await supabase.from('orders').insert({
        user_id: user?.id,
        customer_name: formData.fullName,
        customer_email: formData.email,
        customer_phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postalCode,
        items,
        subtotal,
        tax,
        discount,
        total: totalPrice,
        delivery_date: formData.deliveryDate,
        special_requests: formData.specialRequests,
        payment_method: formData.paymentMethod,
        status: 'completed',
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        console.error('Order insert error:', insertError);
        throw insertError;
      }

      // Save subscriptions to user_subscriptions table
      for (const item of items) {
        if (item.subscription) {
          await supabase.from('user_subscriptions').insert({
            user_id: user?.id,
            product_id: item.productId,
            product_name: item.name,
            start_date: item.subscription.startDate,
            end_date: item.subscription.endDate,
            duration: item.subscription.duration,
            price: item.price,
            status: 'active'
          });
        }
      }

      // Send email notifications
      try {
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            customer_email: formData.email,
            customer_name: formData.fullName,
            customer_phone: formData.phone,
            order_items: items.map(i => `${i.name} x${i.quantity}`).join(', '),
            total_amount: totalPrice.toFixed(2),
            delivery_date: formData.deliveryDate,
            address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } catch (emailError) {
        console.error('Email failed:', emailError);
      }

      // Clear cart and navigate to success page
      clearCart();
      navigate('/checkout/success');
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8">
        <Button
          onClick={() => navigate('/cart')}
          variant="ghost"
          className="mb-4 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Checkout</h1>
        <p className="text-gray-600 mt-2">Complete your order</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handlePlaceOrder} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start gap-3">
                <span className="text-red-500 text-xl">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Customer Information */}
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/account?tab=addresses')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Manage
                  </Button>
                </div>

              {/* Address Selection */}
              {addresses.length > 0 && (
                <div className="mb-6 space-y-3">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      onClick={() => {
                        setSelectedAddress(addr);
                        setFormData(prev => ({
                          ...prev,
                          fullName: addr.name,
                          phone: addr.phone,
                          address: addr.address_line1 + (addr.address_line2 ? ', ' + addr.address_line2 : ''),
                          city: addr.city,
                          postalCode: addr.pincode,
                        }));
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedAddress?.id === addr.id
                          ? 'border-orange-500 bg-orange-50 shadow-sm'
                          : 'border-gray-200 hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 ${
                          selectedAddress?.id === addr.id ? 'text-orange-600' : 'text-gray-400'
                        }`}>
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-gray-900">{addr.name}</p>
                            {addr.is_default && (
                              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{addr.phone}</p>
                          <p className="text-sm text-gray-700">
                            {addr.address_line1}
                            {addr.address_line2 && `, ${addr.address_line2}`}
                          </p>
                          <p className="text-sm text-gray-700">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h3 className="font-semibold mb-4 text-gray-700 text-sm uppercase tracking-wide">Contact Information</h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  placeholder="123 Flower Street"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="400001"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

            {/* Special Requests */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Special Requests</h2>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requests or instructions? (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent h-24 transition"
                />
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                >
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="netbanking">Net Banking</option>
                  <option value="wallets">Digital Wallets</option>
                  <option value="cod">Cash on Delivery</option>
                </select>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin mr-2" />
                  Processing Order...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Place Secure Order
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-orange-600 mt-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
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

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                      ₹{totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-pink-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                  <Lock className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Secure Checkout</span>
                </div>
                <p className="text-xs text-gray-600">
                  Your payment information is encrypted and secure. By placing an order, you agree to our terms and conditions.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
