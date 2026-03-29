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
import { Alert, AlertDescription } from './ui/alert';

const getRedirectUrl = () => {
  if (Capacitor.isNativePlatform()) {
    // Use custom app scheme for Android
    return 'com.evrydayy.app://auth/callback';
  }
  return `${window.location.origin}/auth/callback`;
};

export default function Auth({ onAuthSuccess }: { onAuthSuccess?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');
  const [resetIdentifier, setResetIdentifier] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showResetOtpInput, setShowResetOtpInput] = useState(false);

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
    setError('');
    
    try {
      const redirectUrl = getRedirectUrl();
      console.log('Step 1: Starting Google Sign-In');
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });
      
      if (error) {
        console.error('Google Sign-In error:', error);
        setError(error.message);
        setLoading(false);
        return;
      }
      
      if (data?.url) {
        console.log('Step 2: Opening browser with URL:', data.url);
        
        if (Capacitor.isNativePlatform()) {
          await Browser.open({ url: data.url });
          console.log('Step 3: Browser opened');
          
          Browser.addListener('browserFinished', () => {
            console.log('Browser closed by user');
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (session) {
                console.log('Session found! User:', session.user.email);
                sessionStorage.setItem('splash_shown', '1');
                localStorage.setItem('splash_shown', '1');
                if (onAuthSuccess) onAuthSuccess();
                else window.location.href = '/';
              } else {
                console.log('No session found after browser closed');
              }
            });
          });
        }
      }
    } catch (err: any) {
      console.error('Google Sign-In exception:', err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

  const sendResetOtp = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (resetMethod === 'email') {
        if (!resetIdentifier || !resetIdentifier.includes('@')) {
          setError('Please enter a valid email address');
          setLoading(false);
          return;
        }
        
        // Send password reset email via Supabase
        const { error } = await supabase.auth.resetPasswordForEmail(resetIdentifier, {
          redirectTo: `${window.location.origin}/auth/callback?type=recovery`
        });
        
        if (error) throw error;
        setSuccess('Password reset link sent to your email. Please check your inbox.');
      } else {
        // Phone-based reset
        if (!resetIdentifier || resetIdentifier.length < 10) {
          setError('Please enter a valid phone number');
          setLoading(false);
          return;
        }
        
        // Check if phone exists in database
        const { data: userProfile, error: profileError } = await supabase
          .from('user_profiles')
          .select('user_id, phone')
          .eq('phone', resetIdentifier)
          .single();
        
        if (profileError || !userProfile) {
          setError('Phone number not found in our records');
          setLoading(false);
          return;
        }
        
        // Generate and store OTP
        const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
        sessionStorage.setItem('resetOtp', generatedOtp);
        sessionStorage.setItem('resetPhone', resetIdentifier);
        sessionStorage.setItem('resetUserId', userProfile.user_id);
        
        // In production, send OTP via SMS service (Twilio, AWS SNS, etc.)
        alert(`OTP: ${generatedOtp}\n(Demo mode - In production, this will be sent via SMS)`);
        
        setShowResetOtpInput(true);
        setSuccess('OTP sent to your phone number');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset instructions');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      if (resetMethod === 'phone') {
        // Verify OTP
        const savedOtp = sessionStorage.getItem('resetOtp');
        const savedPhone = sessionStorage.getItem('resetPhone');
        const savedUserId = sessionStorage.getItem('resetUserId');
        
        if (resetOtp !== savedOtp || resetIdentifier !== savedPhone) {
          setError('Invalid OTP');
          setLoading(false);
          return;
        }
        
        if (newPassword !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (newPassword.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        
        // Update password using admin API (requires service role key in production)
        // For now, we'll use the auth.updateUser method
        const { error } = await supabase.auth.updateUser({
          password: newPassword
        });
        
        if (error) throw error;
        
        // Clear session storage
        sessionStorage.removeItem('resetOtp');
        sessionStorage.removeItem('resetPhone');
        sessionStorage.removeItem('resetUserId');
        
        setSuccess('Password reset successful! You can now login with your new password.');
        setTimeout(() => {
          setIsForgotPassword(false);
          setIsLogin(true);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const resetForgotPasswordForm = () => {
    setIsForgotPassword(false);
    setResetIdentifier('');
    setResetOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setShowResetOtpInput(false);
    setError('');
    setSuccess('');
  };

  // Forgot Password View
  if (isForgotPassword) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            {/* Method Selection */}
            <div className="space-y-2">
              <Label>Reset via</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="email"
                    checked={resetMethod === 'email'}
                    onChange={(e) => setResetMethod(e.target.value as 'email')}
                    className="w-4 h-4"
                  />
                  <span>Email</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="phone"
                    checked={resetMethod === 'phone'}
                    onChange={(e) => setResetMethod(e.target.value as 'phone')}
                    className="w-4 h-4"
                  />
                  <span>Phone Number</span>
                </label>
              </div>
            </div>

            {/* Email/Phone Input */}
            {!showResetOtpInput && (
              <div>
                <Label htmlFor="resetIdentifier">
                  {resetMethod === 'email' ? 'Email Address' : 'Phone Number'}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="resetIdentifier"
                    type={resetMethod === 'email' ? 'email' : 'tel'}
                    value={resetIdentifier}
                    onChange={(e) => setResetIdentifier(e.target.value)}
                    placeholder={resetMethod === 'email' ? 'your@email.com' : '+91 9876543210'}
                    required
                  />
                  <Button type="button" onClick={sendResetOtp} disabled={loading}>
                    {loading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
              </div>
            )}

            {/* OTP and Password Reset (Phone only) */}
            {showResetOtpInput && resetMethod === 'phone' && (
              <>
                <div>
                  <Label htmlFor="resetOtp">Enter OTP</Label>
                  <Input
                    id="resetOtp"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="border-green-500 text-green-700">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Button
              type="button"
              variant="link"
              onClick={resetForgotPasswordForm}
              className="w-full"
            >
              Back to Login
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

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
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {success && (
            <Alert className="border-green-500 text-green-700">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
          </Button>
          
          {isLogin && (
            <Button
              type="button"
              variant="link"
              onClick={() => setIsForgotPassword(true)}
              className="w-full text-sm text-orange-600 hover:text-orange-700"
            >
              Forgot Password?
            </Button>
          )}
          
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
