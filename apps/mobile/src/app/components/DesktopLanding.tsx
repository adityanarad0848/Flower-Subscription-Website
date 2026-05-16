import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function DesktopLanding() {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { name: 'Priya Sharma', location: 'Bangalore', text: 'Very convenient service. Flowers are always fresh and on time.' },
    { name: 'Ramesh Iyer', location: 'Chennai', text: 'The old flower pickup is a great happy with the service.' },
    { name: 'Anita Desai', location: 'Mumbai', text: 'Best service for daily puja. Very happy with the quality.' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50 border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <svg className="w-10 h-10" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="20" fill="#EA580C"/>
              <path d="M20 10L22 16L28 16L23 20L25 26L20 22L15 26L17 20L12 16L18 16L20 10Z" fill="white"/>
            </svg>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Mornify</h1>
              <p className="text-xs text-gray-500">Daily Flowers, Pure Devotion</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm">
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-orange-600 font-medium">Home</button>
            <button onClick={() => navigate('/how-it-works')} className="text-gray-700 hover:text-orange-600 font-medium">How it Works</button>
            <button onClick={() => navigate('/')} className="text-gray-700 hover:text-orange-600 font-medium">Plans</button>
            <button onClick={() => navigate('/faq')} className="text-gray-700 hover:text-orange-600 font-medium">About Us</button>
            <button className="text-gray-700 hover:text-orange-600 font-medium">Blog</button>
            <button onClick={() => navigate('/contact')} className="text-gray-700 hover:text-orange-600 font-medium">Contact</button>
          </nav>
          <div className="flex items-center space-x-3">
            <button className="hidden md:flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              <div className="text-left">
                <p className="text-xs leading-none">Get it on</p>
                <p className="text-xs font-semibold leading-none">Google Play</p>
              </div>
            </button>
            <button onClick={() => navigate('/auth')} className="bg-green-700 text-white px-6 py-2.5 rounded-lg hover:bg-green-800 transition font-medium text-sm">
              Start Subscription
            </button>
            <button onClick={() => navigate('/cart')} className="p-2 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-sm text-orange-600">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z"/>
                </svg>
                <span className="font-medium">Daily Flowers, Pure Devotion</span>
              </div>
              <h1 className="text-6xl font-bold text-gray-900 leading-tight">
                Fresh Flowers.
                <br />
                <span className="text-orange-600">Every Morning.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                We deliver fresh flowers to your doorstep daily and pick old flowers. Simple, hassle-free & eco-friendly.
              </p>
              <div className="flex space-x-4">
                <button onClick={() => navigate('/auth')} className="bg-green-700 text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-green-800 transition flex items-center space-x-2">
                  <span>Start Subscription</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
                <button onClick={() => navigate('/how-it-works')} className="bg-white text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition border-2 border-gray-200 flex items-center space-x-2">
                  <span>How it Works</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="flex items-start space-x-2">
                  <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">Fresh & Pure</p>
                    <p className="text-xs text-gray-500">Handpicked Daily</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">Eco Friendly</p>
                    <p className="text-xs text-gray-500">Old Flowers Recycled</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <div>
                    <p className="font-semibold text-sm">On Time</p>
                    <p className="text-xs text-gray-500">Every Morning</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute top-8 right-8 bg-white rounded-2xl shadow-2xl p-5 z-10">
                <div className="flex -space-x-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-orange-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-white"></div>
                </div>
                <p className="text-3xl font-bold text-gray-900">10,000+</p>
                <p className="text-sm text-gray-500">Happy Families</p>
              </div>
              <img src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop&q=80" alt="Fresh Puja Flowers" className="w-full rounded-3xl shadow-2xl"/>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-orange-50 py-6 border-y">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              <span className="text-sm font-semibold">10,000+ Happy Customers</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <span className="text-sm font-semibold">Daily Fresh Delivery</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span className="text-sm font-semibold">Old Flowers Picked Up</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              <span className="text-sm font-semibold">Secure Payments</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span className="text-sm font-semibold">No Hidden Charges</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-4">
            <p className="text-sm text-orange-600 font-medium mb-2">SIMPLE AS 1, 2, 3</p>
            <h2 className="text-4xl font-bold text-gray-900">How It <span className="text-orange-600">Works?</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12 mt-16 relative">
            <div className="text-center relative">
              <div className="bg-orange-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <svg className="w-14 h-14 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <div className="absolute -bottom-2 -right-2 bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">1</div>
              </div>
              <h3 className="text-xl font-bold mb-3">Choose Your Plan</h3>
              <p className="text-gray-600">Pick a plan that suits your daily needs.</p>
              <div className="hidden md:block absolute top-14 -right-6 w-24 h-0.5 border-t-2 border-dashed border-gray-300"></div>
            </div>
            <div className="text-center relative">
              <div className="bg-orange-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <svg className="w-14 h-14 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/>
                </svg>
                <div className="absolute -bottom-2 -right-2 bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">2</div>
              </div>
              <h3 className="text-xl font-bold mb-3">We Deliver Fresh Flowers</h3>
              <p className="text-gray-600">We deliver fresh, handpicked flowers to your doorstep every morning.</p>
              <div className="hidden md:block absolute top-14 -right-6 w-24 h-0.5 border-t-2 border-dashed border-gray-300"></div>
            </div>
            <div className="text-center">
              <div className="bg-orange-50 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                <svg className="w-14 h-14 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                </svg>
                <div className="absolute -bottom-2 -right-2 bg-green-700 text-white w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold">3</div>
              </div>
              <h3 className="text-xl font-bold mb-3">We Pick Old Flowers</h3>
              <p className="text-gray-600">We collect yesterday's flowers respectfully and recycle them in an eco-friendly way.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-4">
            <p className="text-sm text-orange-600 font-medium mb-2">CHOOSE YOUR PLAN</p>
            <h2 className="text-4xl font-bold text-gray-900">Simple Plans, Daily <span className="text-orange-600">Happiness</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-3xl shadow-lg p-8 border-2 border-gray-100">
              <h3 className="text-2xl font-bold mb-2">Basic Plan</h3>
              <p className="text-gray-500 text-sm mb-6">Perfect for small daily rituals</p>
              <div className="mb-6">
                <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=200&h=200&fit=crop&q=80" alt="Basic Flowers" className="w-32 h-32 mx-auto object-cover rounded-full"/>
              </div>
              <div className="mb-6">
                <span className="text-5xl font-bold">₹499</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">Daily fresh flowers (small pack)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm">Old flowers pickup</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text