import { Truck, Clock, MapPin, Package, CheckCircle, Calendar, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';

export function DeliveryInfo() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="mb-6 text-gray-600 hover:text-gray-900 -ml-2"
          size="sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Delivery Information</h1>
          <p className="text-lg text-gray-600">Everything you need to know about our delivery service</p>
        </div>

        {/* Delivery Process */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Truck className="w-7 h-7 text-orange-600" />
            How Delivery Works
          </h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-orange-600">1</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Place Your Order</h3>
                <p className="text-gray-600">Choose your flowers and select delivery dates. Subscribe for regular deliveries or make a one-time purchase.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-orange-600">2</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Fresh Flowers Sourced</h3>
                <p className="text-gray-600">We source fresh flowers daily from local markets early in the morning.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <span className="font-bold text-orange-600">3</span>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Delivered to Your Door</h3>
                <p className="text-gray-600">Our delivery person brings fresh flowers and collects your old flowers for composting.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Delivery Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Delivery Time</h3>
            <p className="text-gray-600 mb-2">Morning: 6:00 AM - 9:00 AM</p>
            <p className="text-sm text-gray-500">Flowers delivered fresh every morning for your puja</p>
          </div>

          {/* Service Areas */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Service Areas</h3>
            <p className="text-gray-600 mb-2">Currently serving Pune</p>
            <p className="text-sm text-gray-500">All major areas including Pimpri-Chinchwad, Kharadi, Hinjewadi, Baner, Aundh, and more</p>
          </div>

          {/* Packaging */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Eco-Friendly Packaging</h3>
            <p className="text-gray-600 mb-2">Zero waste approach</p>
            <p className="text-sm text-gray-500">We use minimal, biodegradable packaging and collect old flowers for composting</p>
          </div>

          {/* Subscription */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-lg mb-3">Flexible Subscriptions</h3>
            <p className="text-gray-600 mb-2">Pause or modify anytime</p>
            <p className="text-sm text-gray-500">Manage your subscription, skip dates, or change delivery address easily</p>
          </div>
        </div>

        {/* Delivery Guarantee */}
        <div className="bg-gradient-to-r from-orange-500 to-pink-600 rounded-xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <CheckCircle className="w-7 h-7" />
            Our Delivery Guarantee
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>100% fresh flowers delivered daily</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>On-time delivery between 6-9 AM</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Free delivery on all orders</p>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Old flower collection & composting</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-6">Delivery FAQs</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">What if I'm not home during delivery?</h3>
              <p className="text-gray-600">Our delivery person will leave the flowers at your doorstep in a safe location. You can also provide special instructions in your address.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I change my delivery address?</h3>
              <p className="text-gray-600">Yes! You can manage multiple addresses and change your delivery location anytime from the 'Manage Addresses' section.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What if I want to skip a delivery?</h3>
              <p className="text-gray-600">You can pause your subscription or skip specific dates from the 'My Subscriptions' page.</p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Is there a delivery charge?</h3>
              <p className="text-gray-600">No! All deliveries are completely free. We believe in providing value to our customers.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
