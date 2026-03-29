import { useNavigate } from "react-router";
import { ArrowLeft, Home, Info, HelpCircle, Mail, Truck, FileText, User } from "lucide-react";
import { useAuth } from "@/app/context/auth";

export function Menu() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/how-it-works", label: "How It Works", icon: Info },
    { path: "/account", label: "Account", icon: User },
  ];

  const supportItems = [
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/contact", label: "Contact Us", icon: Mail },
    { path: "/delivery-info", label: "Delivery Info", icon: Truck },
    { path: "/terms", label: "Terms & Conditions", icon: FileText },
  ];

  // Get user display name from various possible fields
  const getUserDisplayName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || 
           user.user_metadata?.name || 
           user.user_metadata?.display_name ||
           user.email?.split('@')[0] || 
           'User';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="flex items-center px-4 h-14">
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          <h1 className="ml-3 text-base font-bold text-gray-900">Menu</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* User Info */}
        {user && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-pink-600 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                {(user.user_metadata?.full_name ?? user.email ?? 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-lg text-gray-900 truncate">
                  {getUserDisplayName()}
                </p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Menu */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase">Main Menu</p>
          </div>
          <div className="divide-y divide-gray-100">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase">Support</p>
          </div>
          <div className="divide-y divide-gray-100">
            {supportItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center gap-3 px-4 py-4 hover:bg-gray-50 transition-colors"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Login Button for non-logged in users */}
        {!user && (
          <button
            onClick={() => navigate('/auth')}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg transition-all"
          >
            Login / Sign Up
          </button>
        )}
      </div>
    </div>
  );
}
