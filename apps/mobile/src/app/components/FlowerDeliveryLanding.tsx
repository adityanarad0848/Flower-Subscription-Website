import { useState } from 'react';
import { ShoppingCart, Leaf, Recycle, Clock, Users, Truck, Shield, Star, Phone, Mail, MapPin, MessageCircle, ChevronLeft, ChevronRight, Heart, Flower2, Package } from 'lucide-react';

export default function FlowerDeliveryLanding() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { name: 'Sneha Patel', location: 'Mumbai', text: 'The flowers are always so fresh and beautiful. Love that they pick up the old ones too — so convenient!' },
    { name: 'Arjun Mehta', location: 'Delhi', text: 'Best flower subscription I have tried. Delivery is always on time and the quality is amazing.' },
    { name: 'Kavya Nair', location: 'Bangalore', text: 'The old flower pickup service is a game changer. My home always smells wonderful now.' },
  ];

  const plans = [
    {
      name: 'Starter',
      price: '₹399',
      desc: 'Perfect for a small home',
      img: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400&q=80',
      features: ['Small bouquet daily', 'Old flower pickup', 'Delivery by 7 AM', 'Pause anytime'],
      popular: false,
    },
    {
      name: 'Bloom',
      price: '₹699',
      desc: 'Most loved by families',
      img: 'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=400&q=80',
      features: ['Large bouquet daily', 'Old flower pickup', 'Delivery by 6 AM', 'Weekend special flowers', 'Cancel anytime'],
      popular: true,
    },
    {
      name: 'Garden',
      price: 'Custom',
      desc: 'For temples & events',
      img: 'https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=400&q=80',
      features: ['Custom quantity', 'Old flower pickup', 'Priority delivery', 'Dedicated support'],
      popular: false,
    },
  ];

  const flowers = [
    { name: 'Rose Bouquet', price: '₹149', img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=300&q=80', tag: 'Bestseller' },
    { name: 'Marigold Garland', price: '₹99', img: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=300&q=80', tag: 'Daily Puja' },
    { name: 'Lotus Bundle', price: '₹199', img: 'https://images.unsplash.com/photo-1559181567-c3190ca9be46?w=300&q=80', tag: 'Premium' },
    { name: 'Jasmine String', price: '₹79', img: 'https://images.unsplash.com/photo-1487530811015-780780169993?w=300&q=80', tag: 'Fragrant' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-pink-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-3 md:py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center shadow-md">
              <Flower2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-900">BloomBox</h1>
              <p className="text-[10px] text-pink-500 font-medium">Fresh Flowers, Every Day</p>
            </div>
          </div>

          <nav className="hidden lg:flex gap-8 text-sm font-medium text-gray-700">
            <a href="#" className="hover:text-pink-500 transition">Home</a>
            <a href="#how-it-works" className="hover:text-pink-500 transition">How It Works</a>
            <a href="#flowers" className="hover:text-pink-500 transition">Flowers</a>
            <a href="#plans" className="hover:text-pink-500 transition">Plans</a>
            <a href="#contact" className="hover:text-pink-500 transition">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button className="hidden md:block px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full text-sm font-semibold transition shadow-md">
              Subscribe Now
            </button>
            <button className="relative p-2 hover:bg-pink-50 rounded-full transition">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-pink-500 text-white text-[10px] rounded-full flex items-center justify-center">2</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-orange-50">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-200 rounded-full opacity-20 translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-4 md:px-8 py-16 md:py-24 items-center relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Leaf className="w-4 h-4" />
              Fresh • Pure • Eco-Friendly
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-4">
              Beautiful<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">Flowers</span><br />
              Delivered Daily
            </h2>
            <p className="text-gray-600 text-lg mb-8 max-w-md">
              We deliver the freshest flowers to your doorstep every morning — and pick up yesterday's flowers for eco-friendly recycling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full font-bold text-base transition shadow-lg shadow-pink-200 flex items-center justify-center gap-2">
                Start Subscription
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
              <button className="px-8 py-4 border-2 border-gray-200 hover:border-pink-400 text-gray-700 rounded-full font-bold text-base transition flex items-center justify-center gap-2">
                <a href="#how-it-works">See How It Works</a>
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {['bg-pink-300','bg-rose-300','bg-orange-300','bg-red-300'].map((c,i) => (
                  <div key={i} className={`w-9 h-9 ${c} rounded-full border-2 border-white`}></div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400"/>)}
                  <span className="font-bold text-sm ml-1">4.9</span>
                </div>
                <p className="text-xs text-gray-500">Loved by 15,000+ customers</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&q=80"
                alt="Fresh Flowers"
                className="w-full h-[480px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-pink-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Recycle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">Old Flowers Picked Up</p>
                  <p className="text-xs text-gray-500">Eco-friendly recycling</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-pink-100">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-pink-500" />
                <p className="text-xs font-semibold text-gray-700">Delivered by 7 AM</p>
              </div>
              <p className="text-2xl font-extrabold text-gray-900">Every Day</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-gradient-to-r from-pink-500 to-rose-500 py-5">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            {[
              { icon: <Users className="w-5 h-5"/>, text: '15,000+ Happy Customers' },
              { icon: <Truck className="w-5 h-5"/>, text: 'Daily Fresh Delivery' },
              { icon: <Recycle className="w-5 h-5"/>, text: 'Old Flowers Recycled' },
              { icon: <Shield className="w-5 h-5"/>, text: 'Secure & Trusted' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                {item.icon}
                <span className="text-sm font-semibold">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 md:py-28 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-pink-500 font-bold tracking-widest mb-3">SIMPLE AS 1, 2, 3</p>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">How It <span className="text-pink-500">Works</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-16 left-1/3 w-1/3 border-t-2 border-dashed border-pink-200"></div>
            <div className="hidden md:block absolute top-16 right-0 w-1/3 border-t-2 border-dashed border-pink-200"></div>
            {[
              { icon: <Package className="w-10 h-10 text-pink-500"/>, step: '1', title: 'Choose Your Plan', desc: 'Pick a subscription plan that fits your daily flower needs.' },
              { icon: <Truck className="w-10 h-10 text-pink-500"/>, step: '2', title: 'We Deliver Fresh Flowers', desc: 'Handpicked, fresh flowers arrive at your door every morning by 7 AM.' },
              { icon: <Recycle className="w-10 h-10 text-pink-500"/>, step: '3', title: 'We Pick Old Flowers', desc: 'We collect yesterday\'s flowers and recycle them in an eco-friendly way.' },
            ].map((item, i) => (
              <div key={i} className="text-center relative">
                <div className="w-28 h-28 bg-pink-50 rounded-full mx-auto mb-6 flex items-center justify-center shadow-inner">
                  {item.icon}
                </div>
                <div className="w-10 h-10 bg-pink-500 text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-lg shadow-lg shadow-pink-200">
                  {item.step}
                </div>
                <h4 className="font-bold text-xl mb-3 text-gray-900">{item.title}</h4>
                <p className="text-gray-500 text-sm max-w-xs mx-auto">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flower Showcase */}
      <section id="flowers" className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-pink-500 font-bold tracking-widest mb-3">OUR COLLECTION</p>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">Fresh <span className="text-pink-500">Flowers</span> We Deliver</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {flowers.map((flower, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition group overflow-hidden border border-pink-50">
                <div className="relative overflow-hidden">
                  <img src={flower.img} alt={flower.name} className="w-full h-48 object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">{flower.tag}</span>
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition">
                    <Heart className="w-4 h-4 text-pink-400" />
                  </button>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-gray-900 mb-1">{flower.name}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-pink-500 font-bold text-lg">{flower.price}</span>
                    <button className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-semibold rounded-full transition">Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="py-20 md:py-28 px-4 md:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-pink-500 font-bold tracking-widest mb-3">SUBSCRIPTION PLANS</p>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">Simple Plans, Daily <span className="text-pink-500">Joy</span></h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <div key={i} className={`relative rounded-3xl p-8 transition ${plan.popular ? 'bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-2xl shadow-pink-200 md:scale-105' : 'bg-white border-2 border-gray-100 shadow-lg hover:shadow-xl'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 px-5 py-1 rounded-full text-xs font-bold shadow">
                    ⭐ Most Popular
                  </div>
                )}
                <h4 className={`text-2xl font-extrabold mb-1 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h4>
                <p className={`text-sm mb-5 ${plan.popular ? 'text-pink-100' : 'text-gray-500'}`}>{plan.desc}</p>
                <img src={plan.img} alt={plan.name} className="w-full h-44 object-cover rounded-2xl mb-6 shadow-md" />
                <div className="mb-6">
                  <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>{plan.price}</span>
                  {plan.price !== 'Custom' && <span className={`text-sm ml-1 ${plan.popular ? 'text-pink-100' : 'text-gray-500'}`}>/month</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-center gap-3 text-sm ${plan.popular ? 'text-pink-50' : 'text-gray-600'}`}>
                      <svg className={`w-5 h-5 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-green-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3.5 rounded-full font-bold text-sm transition ${plan.popular ? 'bg-white text-pink-500 hover:bg-pink-50 shadow-lg' : 'border-2 border-pink-400 text-pink-500 hover:bg-pink-500 hover:text-white'}`}>
                  {plan.price === 'Custom' ? 'Contact Us' : 'Get Started'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-900 via-pink-800 to-orange-800"></div>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80)', backgroundSize: 'cover' }}></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            Start Your Day with<br />
            <span className="text-pink-300">Freshness & Fragrance</span>
          </h3>
          <p className="text-pink-100 text-lg mb-10">Fresh flowers delivered every morning. Old flowers picked up. Zero hassle.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-pink-600 rounded-full font-bold text-base hover:bg-pink-50 transition shadow-xl">
              Start Subscription
            </button>
            <button className="px-10 py-4 border-2 border-white text-white rounded-full font-bold text-base hover:bg-white/10 transition flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28 px-4 md:px-8 bg-gradient-to-b from-pink-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm text-pink-500 font-bold tracking-widest mb-3">CUSTOMER LOVE</p>
            <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900">What Our <span className="text-pink-500">Customers</span> Say</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition border border-pink-50">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-gray-600 italic mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full flex items-center justify-center font-bold text-white text-lg">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-950 text-gray-400 py-14 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg">BloomBox</h4>
                  <p className="text-xs text-pink-400">Fresh Flowers, Every Day</p>
                </div>
              </div>
              <p className="text-sm mb-5">We deliver fresh flowers daily and pick up old ones — keeping your home beautiful and the planet green.</p>
              <div className="flex gap-3">
                {['f', 'ig', 'tw', 'yt'].map((s, i) => (
                  <a key={i} href="#" className="w-9 h-9 bg-gray-800 hover:bg-pink-500 rounded-full flex items-center justify-center text-xs font-bold transition">{s}</a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="font-bold text-white mb-5">Quick Links</h5>
              <ul className="space-y-2 text-sm">
                {['Home', 'How It Works', 'Flowers', 'Plans', 'About Us'].map((l, i) => (
                  <li key={i}><a href="#" className="hover:text-pink-400 transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-5">Support</h5>
              <ul className="space-y-2 text-sm">
                {['FAQ', 'Delivery Schedule', 'Terms of Service', 'Privacy Policy', 'Refund Policy'].map((l, i) => (
                  <li key={i}><a href="#" className="hover:text-pink-400 transition">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-white mb-5">Contact Us</h5>
              <ul className="space-y-3 text-sm mb-6">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-pink-400" /><span>+91 98765 43210</span></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-pink-400" /><span>hello@bloombox.in</span></li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-pink-400" /><span>Bangalore, India</span></li>
              </ul>
              <h6 className="font-semibold text-white mb-2 text-sm">Newsletter</h6>
              <div className="flex gap-2">
                <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 bg-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
                <button className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg text-sm font-bold transition">→</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>© 2024 BloomBox. All rights reserved. Made with <Heart className="w-4 h-4 inline text-pink-500" /> for flower lovers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
