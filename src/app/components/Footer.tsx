import { useNavigate } from "react-router";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin, Clock, HelpCircle } from "lucide-react";

export function Footer() {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <button onClick={() => handleNavigation('/')} className="inline-block mb-4">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🌺</span>
                <span className="text-xl font-bold text-white">Evrydayy</span>
              </div>
            </button>
            <p className="text-gray-400 text-sm mb-4 leading-relaxed">
              Fresh puja flowers delivered to your door, every day. Experience the divine
              beauty of traditional Indian flowers with zero waste service.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/mornify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/mornify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/mornify"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-orange-500 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Quick Links</h3>
            <ul className="-space-y-1">
              <li>
                <button 
                  onClick={() => handleNavigation('/')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Home
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/how-it-works')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/cart')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Cart
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/account')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  My Account
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/active-subscriptions')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  My Subscriptions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/addresses')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Manage Addresses
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Help */}
          <div>
            <h3 className="text-white font-bold text-lg mb-2">Support & Help</h3>
            <ul className="-space-y-1">
              <li>
                <button 
                  onClick={() => handleNavigation('/faq')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/contact')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/delivery-info')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Delivery Info
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavigation('/terms')} 
                  className="text-gray-400 hover:text-orange-500 transition-colors text-sm block text-left w-full py-0.5 leading-none"
                >
                  Terms & Conditions
                </button>
              </li>
              <li className="pt-2">
                <a 
                  href="mailto:support@mornify.com" 
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm py-0.5 leading-none"
                >
                  <Mail className="w-4 h-4" />
                  support@mornify.com
                </a>
              </li>
              <li>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors text-sm py-0.5 leading-none"
                >
                  <Phone className="w-4 h-4" />
                  +91 98765 43210
                </a>
              </li>
            </ul>
          </div>

          {/* Service Locations */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Service Locations
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-semibold text-sm mb-2">Currently Serving:</p>
                <div className="text-sm text-gray-400">
                  <p className="mb-2">
                    <span className="text-green-500 font-bold">Pune</span>
                  </p>
                  <p className="leading-relaxed">
                    Pimpri-Chinchwad, Kharadi, Viman Nagar, Hinjewadi, Wakad, Baner, Aundh, Kothrud, Shivajinagar, Koregaon Park, Hadapsar, Magarpatta, Undri, Kondhwa, Warje, Karve Nagar
                  </p>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-orange-500 text-sm font-semibold">
                  Expanding to Mumbai & Bangalore soon! 🚀
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              &copy; 2024 Evrydayy Flowers. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <button 
                onClick={() => handleNavigation('/how-it-works')} 
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                Privacy Policy
              </button>
              <button 
                onClick={() => handleNavigation('/terms')} 
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                Terms of Service
              </button>
              <button 
                onClick={() => handleNavigation('/terms')} 
                className="text-gray-400 hover:text-orange-500 transition-colors"
              >
                Refund Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
