import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Phone, Loader } from 'lucide-react';
import { useAuth } from '@/app/context/auth';

export default function AddPhone() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const validatePhone = (phoneNumber: string): boolean => {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSendOtp = async () => {
    setError('');
    
    if (!validatePhone(phone)) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setOtpLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      const response = await fetch('http://192.168.1.11:3000/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyAndSave = async () => {
    setError('');
    
    if (otp.length !== 6) {
      setError('Please enter the 6-digit OTP');
      return;
    }

    if (!user) {
      setError('Please login first');
      return;
    }

    setLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      
      // Verify OTP
      const verifyResponse = await fetch('http://192.168.1.11:3000/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: fullPhone, otp })
      });

      const verifyData = await verifyResponse.json();
      if (!verifyResponse.ok) throw new Error(verifyData.error || 'Invalid OTP');
      
      // Update user profile with verified phone number
      const { error: updateError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          phone: fullPhone,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id'
        });

      if (updateError) throw updateError;

      navigate('/checkout', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-pink-500 to-pink-600 flex flex-col">
      {/* Header */}
      <div className="shrink-0 px-4 pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
          <Phone className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          {otpSent ? 'Verify Phone Number' : 'Add Phone Number'}
        </h1>
        <p className="text-white/80 text-center text-sm mb-8">
          {otpSent ? `OTP sent to +91${phone}` : 'We need your phone number for delivery updates'}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-t-3xl px-6 py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {!otpSent ? (
          <>
            {/* Phone Input */}
            <div className="flex gap-3 mb-6">
              <div className="w-20 h-14 border-2 border-gray-200 rounded-xl flex items-center justify-center bg-white">
                <span className="text-2xl">🇮🇳</span>
              </div>
              <div className="flex-1 relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-900 font-semibold">
                  +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) setPhone(value);
                  }}
                  placeholder="Enter Phone Number"
                  className="w-full h-14 pl-16 pr-4 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                  disabled={otpLoading}
                  autoFocus
                />
              </div>
            </div>

            {/* Send OTP Button */}
            <button
              onClick={handleSendOtp}
              disabled={otpLoading || phone.length !== 10}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 active:from-orange-700 active:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {otpLoading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </>
        ) : (
          <>
            {/* OTP Input */}
            <div className="mb-6">
              <input
                type="tel"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  if (value.length <= 6) setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                className="w-full h-14 px-4 border-2 border-gray-200 rounded-xl text-gray-900 text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyAndSave}
              disabled={loading || otp.length !== 6}
              className="w-full h-14 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 active:from-orange-700 active:to-pink-800 disabled:opacity-50 disabled:cursor-not-allowed text-white text-lg font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mb-3"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify & Continue'
              )}
            </button>

            {/* Resend OTP */}
            <button
              onClick={() => {
                setOtpSent(false);
                setOtp('');
                setError('');
              }}
              className="w-full text-orange-600 text-sm font-medium"
            >
              Change Number
            </button>
          </>
        )}

        <p className="text-center text-xs text-gray-500 mt-4">
          Your phone number will be verified and used for order updates
        </p>
      </div>
    </div>
  );
}
