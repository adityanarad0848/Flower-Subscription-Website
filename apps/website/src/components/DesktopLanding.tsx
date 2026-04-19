import { useNavigate } from 'react-router-dom';
import { Flower2, Clock, Truck, Shield, Star } from 'lucide-react';

export default function DesktopLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Flower2 className="h-8 w-8 text-orange-600" />
            <h1 className="text-2xl font-bold text-orange-600">Mornify</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-700 hover:text-orange-600">Features</a>
            <a href="#how-it-works" className="text-gray-700 hover:text-orange-600">How It Works</a>
            <a href="#pricing" className="text-gray-700 hover:text-orange-600">Pricing</a>
          </nav>
          <button
            onClick={() => navigate('/auth')}
            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Fresh Puja Flowers Delivered Daily
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Subscribe to daily fresh flower delivery for your puja. Choose from roses, marigolds, jasmine, and more. 
              Never worry about buying flowers again.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/auth')}
                className="bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-orange-700 transition shadow-lg"
              >
                Start Your Subscription
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="bg-white text-orange-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition border-2 border-orange-600"
              >
                Learn More
              </button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/hero-image.svg"
              alt="Fresh Flowers"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Mornify?</h2>
            <p className="text-xl text-gray-600">Experience the convenience of daily fresh flower delivery</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Flower2 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fresh Daily</h3>
              <p className="text-gray-600">Handpicked fresh flowers delivered every morning</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Flexible Plans</h3>
              <p className="text-gray-600">Choose daily, weekly, or monthly subscription plans</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Doorstep Delivery</h3>
              <p className="text-gray-600">Delivered right to your doorstep every morning</p>
            </div>
            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">100% satisfaction guarantee on every delivery</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 3 simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold mb-3">Choose Your Flowers</h3>
              <p className="text-gray-600">Select from roses, marigolds, jasmine, and more varieties</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold mb-3">Select Your Plan</h3>
              <p className="text-gray-600">Pick a subscription plan that fits your needs</p>
            </div>
            <div className="text-center">
              <div className="bg-orange-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold mb-3">Enjoy Daily Delivery</h3>
              <p className="text-gray-600">Receive fresh flowers at your doorstep every morning</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-orange-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Excellent service! Fresh flowers every morning. Makes my daily puja so convenient."
              </p>
              <p className="font-semibold">- Priya Sharma</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Best flower subscription service! Quality is always top-notch and delivery is always on time."
              </p>
              <p className="font-semibold">- Rajesh Kumar</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-4">
                "Love the variety of flowers available. The subscription plans are very flexible and affordable."
              </p>
              <p className="font-semibold">- Meera Patel</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-orange-600 py-20">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Flower Subscription?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of happy customers enjoying fresh flowers daily
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-orange-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Flower2 className="h-6 w-6" />
                <h3 className="text-xl font-bold">Mornify</h3>
              </div>
              <p className="text-gray-400">Fresh flowers delivered daily to your doorstep</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="#pricing" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><button onClick={() => navigate('/faq')} className="hover:text-white">FAQ</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white">Contact Us</button></li>
                <li><button onClick={() => navigate('/terms')} className="hover:text-white">Terms & Conditions</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Download App</h4>
              <p className="text-gray-400 mb-4">Get our mobile app for the best experience</p>
              <button
                onClick={() => navigate('/')}
                className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
              >
                Open Mobile App
              </button>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2026 Mornify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
