import { Link } from "react-router";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {/* Brand */}
          <div>
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              Fresh puja flowers delivered to your door, every day. Experience the divine
              beauty of traditional Indian flowers with our curated subscription boxes.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-orange-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-orange-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>&copy; 2026 EvryDay Flowers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}