import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Browser } from '@capacitor/browser';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/app/context/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const getRedirectUrl = () => {
  if (Capacitor.isNativePlatform()) {
    return 'http://localhost';
  }
  return `${window.location.origin}/auth/callback`;
};

export default function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const sendOtp = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    setError('');
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    sessionStorage.setItem('otp', generatedOtp);
    sessionStorage.setItem('otpPhone', phone);
    alert(`OTP: ${generatedOtp} (Demo mode - In production, this will be sent via SMS)`);
    setShowOtpInput(true);
    setLoading(false);
  };

  const verifyOtp = () => {
    const savedOtp = sessionStorage.getItem('otp');
    const savedPhone = sessionStorage.getItem('otpPhone');
    if (otp === savedOtp && phone === savedPhone) {
      sessionStorage.removeItem('otp');
      sessionStorage.removeItem('otpPhone');
      return true;
    }
    return false;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (onAuthSuccess) onAuthSuccess();
        else window.location.href = '/';
      } else {
        if (!showOtpInput) {
          setError('Please verify your phone number first');
          setLoading(false);
          return;
        }
        if (!verifyOtp()) {
          setError('Invalid OTP');
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          await supabase.from('user_profiles').insert({
            user_id: data.user.id,
            full_name: fullName,
            phone,
            address
          });
          await supabase.from('user_wallets').insert({
            user_id: data.user.id,
            balance: 0
          });
        }
        if (onAuthSuccess) onAuthSuccess();
        else window.location.href = '/';
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    if (Capacitor.isNativePlatform()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost',
          skipBrowserRedirect: true
        }
      });
      if (error) { setError(error.message); setLoading(false); return; }
      if (data?.url) {
        await Browser.open({ url: data.url });
      }
    } else {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? 'Login' : 'Create Account'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="phone">Phone *</Label>
                <div className="flex gap-2">
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    disabled={showOtpInput}
                    placeholder="+91 9876543210"
                  />
                  {!showOtpInput && (
                    <Button type="button" onClick={sendOtp} disabled={loading}>
                      Send OTP
                    </Button>
                  )}
                </div>
              </div>
              {showOtpInput && (
                <div>
                  <Label htmlFor="otp">Enter OTP *</Label>
                  <Input
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </div>
              )}
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
              </div>
            </>
          )}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
          <Button type="button" variant="link" onClick={() => setIsLogin(!isLogin)} className="w-full">
            {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
          </Button>
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>
          <Button type="button" onClick={handleGoogleSignIn} disabled={loading} variant="outline" className="w-full">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
