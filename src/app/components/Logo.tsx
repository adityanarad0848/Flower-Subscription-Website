export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Custom Evrydayy Logo - Sun with flower petals representing daily rituals */}
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Outer petals - representing diverse flowers */}
        <circle cx="20" cy="8" r="2.5" fill="#F97316" />
        <circle cx="28" cy="11" r="2.5" fill="#EC4899" />
        <circle cx="32" cy="20" r="2.5" fill="#8B5CF6" />
        <circle cx="28" cy="29" r="2.5" fill="#F59E0B" />
        <circle cx="20" cy="32" r="2.5" fill="#EF4444" />
        <circle cx="12" cy="29" r="2.5" fill="#EC4899" />
        <circle cx="8" cy="20" r="2.5" fill="#F97316" />
        <circle cx="12" cy="11" r="2.5" fill="#8B5CF6" />
        
        {/* Center sun - representing daily ritual */}
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
      <div className="flex flex-col leading-none">
        <span className="font-bold text-xl text-gray-900">Evrydayy</span>
        <span className="text-xs text-gray-500 tracking-wide">FLOWERS</span>
      </div>
    </div>
  );
}
