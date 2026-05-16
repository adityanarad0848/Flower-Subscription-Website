import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader } from 'lucide-react';

export default function PhoneAuth() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hasVerified, setHasVerified] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<boolean[]>([false, false, false]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dynamic lifestyle-focused banners
  const slides = [
    {
      gradient: 'from-rose-400 via-pink-400 to-orange-400',
      text: 'FRESH FLOWERS\nEVERY MORNING',
      subtext: 'Daily puja flowers delivered & used flowers picked up',
      icon: '🌺',
      bgPattern: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
    {
      gradient: 'from-blue-400 via-cyan-400 to-teal-400',
      text: 'MILK & ESSENTIALS\nDELIVERED DAILY',
      subtext: 'Milk, bread, newspapers — manage everything',
      icon: '🥛',
      bgPattern: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
    {
      gradient: 'from-indigo-400 via-purple-400 to-pink-400',
      text: 'DOORSTEP\nCONVENIENCE',
      subtext: 'Car wash & more services at your doorstep',
      icon: '🚗',
      bgPattern: 'radial-gradient(circle at 40% 30%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 60% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
    },
  ];

  // Preload images - not needed for gradients
  useEffect(() => {
    // Gradients load instantly, no preloading needed
    setImageLoaded([true, true, true]);
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hasVerified) {
      checkExistingAuth();
    }
  }, [hasVerified]);

  const checkExistingAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: addresses } = await supabase
        .from('user_addresses')
        .select('*')
        .eq('user_id', user.id);
      
      if (addresses && addresses.length > 0) {
        navigate('/', { replace: true });
      }
    }
  };

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendOTP = async () => {
    setError('');
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setPhoneLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      
      const response = await fetch('http://192.168.1.11:3000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setPhoneLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      
      const response = await fetch('http://192.168.1.11:3000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone, otp })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Invalid OTP');

      const internalEmail = `${phone}@mornify.internal`;
      const password = fullPhone + '_mornify_2024';

      let authData = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password
      });

      if (authData.error?.message?.includes('Invalid login credentials')) {
        const signUpResult = await supabase.auth.signUp({
          email: internalEmail,
          password,
          options: {
            data: {
              phone: fullPhone,
              auth_method: 'whatsapp_otp'
            },
            emailRedirectTo: undefined
          }
        });

        if (signUpResult.error) throw signUpResult.error;
        
        if (signUpResult.data.user) {
          setHasVerified(true);
          
          await supabase.from('user_profiles').insert({
            user_id: signUpResult.data.user.id,
            full_name: '',
            phone: fullPhone,
            address: ''
          });
          await supabase.from('user_wallets').insert({ 
            user_id: signUpResult.data.user.id, 
            balance: 0 
          });
          
          sessionStorage.setItem('splash_shown', '1');
          localStorage.setItem('splash_shown', '1');

          await new Promise(resolve => setTimeout(resolve, 100));
          navigate('/address-map?from=auth', { replace: true });
        }
      } else if (authData.error) {
        throw authData.error;
      } else if (authData.data.user) {
        setHasVerified(true);
        
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('user_id')
          .eq('user_id', authData.data.user.id)
          .single();
        
        if (!profile) {
          await supabase.from('user_profiles').insert({
            user_id: authData.data.user.id,
            full_name: '',
            phone: fullPhone,
            address: ''
          });
          await supabase.from('user_wallets').insert({ 
            user_id: authData.data.user.id, 
            balance: 0 
          });
        }
        
        sessionStorage.setItem('splash_shown', '1');
        localStorage.setItem('splash_shown', '1');

        const { data: addresses } = await supabase
          .from('user_addresses')
          .select('id')
          .eq('user_id', authData.data.user.id)
          .limit(1);
        
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!addresses || addresses.length === 0) {
          navigate('/address-map?from=auth', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with Google');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-white flex flex-col relative overflow-hidden">
      {/* Subtle floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-orange-300/20"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 15 + 20}s`,
            }}
          />
        ))}
      </div>

      {/* Hero Section - Better Positioned */}
      <div className="flex-1 relative overflow-hidden pt-20 pb-12">
        {/* Background Gradients with Patterns */}
        <div className="absolute inset-0">
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div 
                className={`w-full h-full bg-gradient-to-br ${slide.gradient}`}
                style={{ backgroundImage: slide.bgPattern }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-white" />
            </div>
          ))}
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 text-center">
          <div
            className={`transition-all duration-700 transform ${
              isTransitioning ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'
            }`}
          >
            {/* Service Icon */}
            <div className="text-8xl mb-6 filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.4)]">
              {slides[currentSlide].icon}
            </div>
            <h1 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-2 whitespace-pre-line drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
              {slides[currentSlide].text}
            </h1>
            <p className="text-white text-sm md:text-base font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] max-w-sm mx-auto">
              {slides[currentSlide].subtext}
            </p>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${
                idx === currentSlide ? 'w-8 bg-white' : 'w-1 bg-white/40'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Auth Section */}
      <div className="px-6 pb-8 pt-6 relative z-20">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
          Log in or sign up
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <>
            {/* Phone Input */}
            <div className="flex gap-3 mb-6">
              <div className="w-14 h-12 border border-gray-300 rounded-lg flex items-center justify-center bg-white/80 backdrop-blur-sm shrink-0">
                <span className="text-base">🇮🇳</span>
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 font-medium text-sm">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) setPhone(value);
                  }}
                  placeholder="Enter phone number"
                  className="w-full h-12 pl-12 pr-4 border border-gray-300 rounded-lg text-gray-900 text-sm placeholder-gray-400 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                  disabled={phoneLoading}
                />
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleSendOTP}
              disabled={phoneLoading || phone.length !== 10}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-3"
            >
              {phoneLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Continue'
              )}
            </button>

            {/* Divider */}
            <div className="relative mb-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-gradient-to-b from-orange-50 to-white text-gray-500">or</span>
              </div>
            </div>

            {/* Google Sign-In Button */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full h-12 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg flex items-center justify-center gap-3 hover:bg-white hover:border-gray-400 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 mb-6"
            >
              {googleLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin text-gray-600" />
                  <span className="text-gray-700 text-sm font-medium">Signing you in...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-gray-700 text-sm font-medium">Continue with Google</span>
                </>
              )}
            </button>

            {/* Terms */}
            <p className="text-center text-xs text-gray-500 leading-relaxed">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-gray-700 underline">
                Terms
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-gray-700 underline">
                Privacy Policy
              </a>
            </p>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
                Enter the 6-digit OTP sent to your WhatsApp
                <br />
                <span className="font-semibold text-gray-900">+91 {phone}</span>
              </p>
              <input
                type="tel"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                placeholder="Enter OTP"
                className="w-full h-14 px-4 border border-gray-300 rounded-lg text-center text-2xl tracking-widest text-gray-900 placeholder-gray-400 bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                disabled={phoneLoading}
                maxLength={6}
                autoFocus
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOTP}
              disabled={phoneLoading || otp.length !== 6}
              className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 active:scale-[0.98] disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 mb-4"
            >
              {phoneLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Change Number */}
            <button
              onClick={() => {
                setOtp('');
                setStep('phone');
              }}
              className="w-full text-center text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
            >
              Change Phone Number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
