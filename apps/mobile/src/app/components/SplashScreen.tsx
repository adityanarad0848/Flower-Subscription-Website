import { useEffect, useState } from 'react';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-white flex items-center justify-center z-50 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Logo */}
        <div className="mb-6">
          <svg
            width="100"
            height="100"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto"
          >
            {/* Outer petals */}
            <circle cx="20" cy="8" r="2.5" fill="#F97316" />
            <circle cx="28" cy="11" r="2.5" fill="#EC4899" />
            <circle cx="32" cy="20" r="2.5" fill="#8B5CF6" />
            <circle cx="28" cy="29" r="2.5" fill="#F59E0B" />
            <circle cx="20" cy="32" r="2.5" fill="#EF4444" />
            <circle cx="12" cy="29" r="2.5" fill="#EC4899" />
            <circle cx="8" cy="20" r="2.5" fill="#F97316" />
            <circle cx="12" cy="11" r="2.5" fill="#8B5CF6" />
            
            {/* Center sun */}
            <circle cx="20" cy="20" r="8" fill="url(#sunGradient)" />
            
            {/* Inner light rays */}
            <circle cx="20" cy="20" r="5" fill="#FEF3C7" opacity="0.8" />
            
            <defs>
              <radialGradient id="sunGradient">
                <stop offset="0%" stopColor="#FDE047" />
                <stop offset="100%" stopColor="#F59E0B" />
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Evrydayy
        </h1>
        
        {/* Tagline */}
        <p className="text-sm text-gray-600 font-medium">
          Delivery to Visarjan
        </p>
      </div>
    </div>
  );
}
