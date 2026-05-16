import { ShoppingCart, Leaf, Recycle, Clock, Users, Truck, Shield, DollarSign, MessageCircle, Calendar, Package, Phone, Mail, MapPin, Star, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/context/auth';
import { supabase } from '@/lib/supabase';

export default function PujanLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth/phone', { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('phone')
        .eq('user_id', user.id)
        .maybeSingle();

      // If no profile exists, create one for Google sign-in users
      if (!profile) {
        await supabase.from('user_profiles').insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
          phone: user.phone || '',
          address: ''
        });
        await supabase.from('user_wallets').insert({ 
          user_id: user.id, 
          balance: 0 
        });
      }

      const { data: addresses } = await supabase
        .from('user_addresses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1);

      if (!addresses || addresses.length === 0) {
        navigate('/address-map?from=auth', { replace: true });
        return;
      }

      setChecking(false);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth/phone', { replace: true });
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }
  const testimonials = [
    { name: 'Priya Sharma', location: 'Bangalore', text: 'Very convenient service. Flowers are always fresh and on time.' },
    { name: 'Ramesh Iyer', location: 'Chennai', text: 'The old flower pickup is a great initiative.' },
    { name: 'Anita Desai', location: 'Mumbai', text: 'Best service for daily puja. Very happy with the quality.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="18" fill="#f97316" opacity="0.2"/>
              <path d="M20 8 L24 16 L32 18 L26 24 L28 32 L20 28 L12 32 L14 24 L8 18 L16 16 Z" fill="#f97316"/>
            </svg>
            <div>
              <h1 className="font-bold text-base md:text-lg">Pujan</h1>
              <p className="text-[10px] md:text-xs text-gray-600">Daily Flowers, Pure Devotion</p>
            </div>
          </div>
          <nav className="hidden lg:flex gap-6 text-sm font-medium">
            <a href="#" className="hover:text-orange-500 transition">Home</a>
            <a href="#works" className="hover:text-orange-500 transition">How it Works</a>
            <a href="#plans" className="hover:text-orange-500 transition">Plans</a>
            <a href="#about" className="hover:text-orange-500 transition">About Us</a>
            <a href="#blog" className="hover:text-orange-500 transition">Blog</a>
            <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2 md:gap-3">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-8 md:h-10 cursor-pointer"/>
            {user ? (
              <button 
                onClick={() => navigate('/profile')}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm font-medium transition"
              >
                <User className="w-4 h-4" />
                Profile
              </button>
            ) : (
              <button 
                onClick={() => navigate('/auth/phone')}
                className="hidden md:block px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded text-sm font-medium transition"
              >
                Login / Sign Up
              </button>
            )}
            <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-orange-500 transition" onClick={() => navigate('/cart')} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 px-4 md:px-6 py-12 md:py-20">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Leaf className="w-4 h-4 text-orange-500"/>
              <p className="text-sm text-orange-500 font-medium">Daily Flowers, Pure Devotion</p>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 leading-tight">Fresh Flowers.</h2>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-orange-500 mb-6 leading-tight">Every Morning.</h2>
            <p className="text-gray-600 text-base md:text-lg mb-8 max-w-md">We deliver fresh flowers to your doorstep daily and pick old flowers. Simple, pure & hassle free.</p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate('/auth/phone')}
                className="px-6 py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                {user ? 'Go to Profile' : 'Login / Sign Up'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button className="px-6 py-3 border-2 border-gray-300 hover:border-orange-500 rounded-lg font-medium transition flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                How It Works
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-5 h-5 text-orange-500"/>
                </div>
                <div>
                  <p className="font-semibold text-sm">Fresh & Pure</p>
                  <p className="text-xs text-gray-600">Handpicked Daily</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0">
                  <Recycle className="w-5 h-5 text-green-600"/>
                </div>
                <div>
                  <p className="font-semibold text-sm">Eco Friendly</p>
                  <p className="text-xs text-gray-600">Old Flowers Recycled</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-blue-600"/>
                </div>
                <div>
                  <p className="font-semibold text-sm">On Time</p>
                  <p className="text-xs text-gray-600">Every Morning</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 rounded-2xl p-6 md:p-8 overflow-hidden">
              <div className="relative z-10">
                <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80" alt="Fresh Puja Flowers" className="w-full h-[400px] object-cover rounded-xl shadow-2xl"/>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-orange-200/20 to-transparent"></div>
            </div>
            <div className="absolute top-4 right-4 bg-white p-4 rounded-xl shadow-xl border border-orange-100">
              <div className="flex items-center gap-1 mb-1">
                <Star className="w-5 h-5 fill-orange-500 text-orange-500"/>
                <p className="text-2xl font-bold">4.8</p>
              </div>
              <p className="text-sm font-semibold text-gray-700">10,000+</p>
              <p className="text-xs text-gray-500">Happy Families</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-6 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
            <div className="flex items-center gap-3 justify-center">
              <Users className="w-5 h-5 text-orange-500 flex-shrink-0"/>
              <span className="text-xs md:text-sm font-medium">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Truck className="w-5 h-5 text-orange-500 flex-shrink-0"/>
              <span className="text-xs md:text-sm font-medium">Daily Fresh Delivery</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Recycle className="w-5 h-5 text-orange-500 flex-shrink-0"/>
              <span className="text-xs md:text-sm font-medium">Old Flowers Picked Up</span>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <Shield className="w-5 h-5 text-orange-500 flex-shrink-0"/>
              <span className="text-xs md:text-sm font-medium">Secure Payments</span>
            </div>
            <div className="flex items-center gap-3 justify-center col-span-2 md:col-span-1">
              <DollarSign className="w-5 h-5 text-orange-500 flex-shrink-0"/>
              <span className="text-xs md:text-sm font-medium">No Hidden Charges</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="works" className="py-16 md:py-24 px-4 md:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-sm text-orange-500 font-semibold mb-2 tracking-wider">SIMPLE AS 1, 2, 3</p>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">How It <span className="text-orange-500">Works?</span></h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 relative">
          <div className="hidden md:block absolute top-32 left-1/3 w-1/3 h-0.5 bg-gradient-to-r from-orange-200 to-orange-300"></div>
          <div className="hidden md:block absolute top-32 right-0 w-1/3 h-0.5 bg-gradient-to-r from-orange-200 to-orange-300"></div>
          <div className="text-center relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Calendar className="w-12 h-12 text-green-700"/>
            </div>
            <div className="w-10 h-10 bg-green-700 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg shadow-md">1</div>
            <h4 className="font-bold text-lg mb-3">Choose Your Plan</h4>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">Pick a plan that suits your daily needs.</p>
          </div>
          <div className="text-center relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Truck className="w-12 h-12 text-green-700"/>
            </div>
            <div className="w-10 h-10 bg-green-700 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg shadow-md">2</div>
            <h4 className="font-bold text-lg mb-3">We Deliver Fresh Flowers</h4>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">We deliver fresh, handpicked flowers to your doorstep every morning.</p>
          </div>
          <div className="text-center relative">
            <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Package className="w-12 h-12 text-green-700"/>
            </div>
            <div className="w-10 h-10 bg-green-700 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg shadow-md">3</div>
            <h4 className="font-bold text-lg mb-3">We Pick Old Flowers</h4>
            <p className="text-sm text-gray-600 max-w-xs mx-auto">We collect old flowers respectfully and recycle them in an eco-friendly way.</p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-orange-500 font-semibold mb-2 tracking-wider flex items-center justify-center gap-2">
              <Leaf className="w-4 h-4"/>
              CHOOSE YOUR PLAN
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">Simple Plans, Daily <span className="text-orange-500">Happiness</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <h4 className="text-2xl font-bold mb-2">Basic Plan</h4>
              <p className="text-sm text-gray-600 mb-6">Perfect for small daily rituals</p>
              <div className="mb-6 relative">
                <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80" alt="Basic Plan Flowers" className="w-full h-48 object-cover rounded-xl"/>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹499</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Daily fresh flowers (small pack)</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Old flowers pickup</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Delivery by 7 AM</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Pause anytime</span>
                </li>
              </ul>
              <button className="w-full py-3 border-2 border-gray-300 hover:border-green-700 hover:text-green-700 rounded-lg font-semibold transition">Choose Plan</button>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl hover:shadow-3xl transition border-2 border-orange-500 relative transform md:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-1.5 rounded-full text-xs font-bold shadow-lg">Most Popular</div>
              <h4 className="text-2xl font-bold mb-2">Premium Plan</h4>
              <p className="text-sm text-gray-600 mb-6">For a beautiful daily experience</p>
              <div className="mb-6 relative">
                <img src="https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80" alt="Premium Plan Flowers" className="w-full h-48 object-cover rounded-xl"/>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹799</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Daily fresh flowers (large pack)</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Old flowers pickup</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Delivery by 7 AM</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Fresh flowers on weekends</span>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span>Cancel anytime</span>
                </li>
              </ul>
              <button className="w-full py-3 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition shadow-lg">Choose Plan</button>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-gray-100">
              <h4 className="text-2xl font-bold mb-2">Custom Plan</h4>
              <p className="text-sm text-gray-600 mb-6">Made for your unique needs</p>
              <div className="mb-6 relative">
                <img src="https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80" alt="Custom Plan Flowers" className="w-full h-48 object-cover rounded-xl"/>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">Custom</span>
              </div>
              <p className="text-sm text-gray-600 mb-8 min-h-[120px]">Contact us for custom plans for events, temples, or special needs.</p>
              <button className="w-full py-3 border-2 border-gray-300 hover:border-green-700 hover:text-green-700 rounded-lg font-semibold transition mt-8">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 md:py-28 px-4 md:px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-orange-800 to-orange-900"></div>
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80)', backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Start Your Day<br/>
                with <span className="text-orange-300">Purity, Positivity</span><br/>
                and Fragrance.
              </h3>
              <p className="text-lg text-orange-100 mb-8">We bring nature's freshest blessings to your doorstep.</p>
              <button className="px-8 py-4 bg-green-700 hover:bg-green-800 text-white rounded-lg font-semibold transition shadow-xl flex items-center gap-2">
                Start Subscription
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
            <div className="hidden md:block">
              <img src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&q=80" alt="Puja Setup" className="rounded-2xl shadow-2xl"/>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section id="about" className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-orange-500 font-semibold mb-2 tracking-wider flex items-center justify-center gap-2">
              <Star className="w-4 h-4"/>
              WHY CHOOSE US
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">Why Thousands <span className="text-orange-500">Trust Us</span></h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Leaf className="w-8 h-8 text-green-600"/>
              </div>
              <h4 className="font-bold mb-2 text-sm md:text-base">Fresh Every Morning</h4>
              <p className="text-xs md:text-sm text-gray-600">Handpicked flowers delivered daily</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <Recycle className="w-8 h-8 text-green-600"/>
              </div>
              <h4 className="font-bold mb-2 text-sm md:text-base">Eco Friendly</h4>
              <p className="text-xs md:text-sm text-gray-600">Old flowers are collected and recycled</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="w-8 h-8 text-blue-600"/>
              </div>
              <h4 className="font-bold mb-2 text-sm md:text-base">On-Time Delivery</h4>
              <p className="text-xs md:text-sm text-gray-600">We value your time, always delivered by 7 AM</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-50 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-orange-600"/>
              </div>
              <h4 className="font-bold mb-2 text-sm md:text-base">Affordable Plans</h4>
              <p className="text-xs md:text-sm text-gray-600">High quality flowers at the best prices</p>
            </div>
            <div className="text-center col-span-2 md:col-span-1">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-purple-50 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-purple-600"/>
              </div>
              <h4 className="font-bold mb-2 text-sm md:text-base">Easy Management</h4>
              <p className="text-xs md:text-sm text-gray-600">Manage your subscription easily on WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-orange-500 font-semibold mb-2 tracking-wider flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4"/>
              WHAT OUR CUSTOMERS SAY
            </p>
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold">Loved by <span className="text-orange-500">Thousands</span> of Devotees</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-orange-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-orange-500 text-orange-500"/>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center font-bold text-orange-700">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Section */}
      <section className="py-16 md:py-24 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-200 to-orange-100 rounded-3xl transform rotate-6"></div>
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80" alt="Mobile App" className="relative z-10 rounded-3xl shadow-2xl"/>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Manage Everything<br/>from Your Phone</h3>
              <p className="text-gray-600 mb-8 text-lg">Pause, resume, or update your plan anytime. It's that simple.</p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get it on Google Play" className="h-14 cursor-pointer"/>
                <button className="flex items-center gap-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition">
                  <MessageCircle className="w-5 h-5"/>
                  Order on WhatsApp
                </button>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-xs text-center">QR Code</div>
                </div>
                <p className="text-sm text-gray-600">Scan to download the app</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-gray-300 py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#f97316" opacity="0.2"/>
                  <path d="M20 8 L24 16 L32 18 L26 24 L28 32 L20 28 L12 32 L14 24 L8 18 L16 16 Z" fill="#f97316"/>
                </svg>
                <div>
                  <h4 className="font-bold text-white">Pujan</h4>
                  <p className="text-xs text-gray-400">Daily Flowers, Pure Devotion</p>
                </div>
              </div>
              <p className="text-sm mb-4">We deliver fresh puja flowers to your doorstep every morning and pick up old flowers.</p>
              <div className="flex gap-3">
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition">f</a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition">t</a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition">in</a>
                <a href="#" className="w-8 h-8 bg-gray-800 hover:bg-orange-500 rounded-full flex items-center justify-center transition">yt</a>
              </div>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition">Home</a></li>
                <li><a href="#works" className="hover:text-orange-500 transition">How It Works</a></li>
                <li><a href="#plans" className="hover:text-orange-500 transition">Plans</a></li>
                <li><a href="#about" className="hover:text-orange-500 transition">About Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Support</h5>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-orange-500 transition">FAQ</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Schedule & Delivery</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-orange-500 transition">Refund & Returns</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-4">Contact Us</h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-orange-500"/>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500"/>
                  <span>hello@pujan.in</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-orange-500"/>
                  <span>Bangalore, India</span>
                </li>
              </ul>
              <div className="mt-6">
                <h6 className="font-semibold text-white mb-2">Newsletter</h6>
                <div className="flex gap-2">
                  <input type="email" placeholder="Subscribe for updates" className="flex-1 px-3 py-2 bg-gray-800 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"/>
                  <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium text-sm transition">→</button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>&copy; 2024 Pujan. All rights reserved. Made with ❤️ for devotees.</p>
          </div>
        </div>
      </footer>

      {/* Floating Login Button for Mobile */}
      {!user && (
        <button
          onClick={() => navigate('/auth/phone')}
          className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all hover:scale-110"
        >
          <User className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
